from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import torch
import inspect
from peft import PeftModel, LoraConfig
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import shap

# Monkey-patch LoraConfig to ignore unexpected kwargs from newer PEFT versions
valid_keys = inspect.signature(LoraConfig.__init__).parameters.keys()
orig_init = LoraConfig.__init__
def patched_init(self, *args, **kwargs):
    filtered_kwargs = {k: v for k, v in kwargs.items() if k in valid_keys}
    orig_init(self, *args, **filtered_kwargs)
LoraConfig.__init__ = patched_init

LABEL_MAP = {
    0: "Anxiety",
    1: "Bipolar Disorder",
    2: "Depression",
    3: "Normal",
    4: "Personality Disorder",
    5: "Stress",
    6: "Suicidal"
}

# Global variables for model
tokenizer = None
model = None
text_explainer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global tokenizer, model, text_explainer
    print("Loading DistilBERT tokenizer...")
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    
    print("Loading base DistilBERT model...")
    base_model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased',
        num_labels=len(LABEL_MAP),
        id2label=LABEL_MAP,
        label2id={v: k for k, v in LABEL_MAP.items()}
    )
    
    print("Loading PEFT adapters from NathanSJSU01/distilBERT_mentalhealth_detection...")
    model = PeftModel.from_pretrained(base_model, "NathanSJSU01/distilBERT_mentalhealth_detection")
    model.eval()
    print("Model loaded successfully!")
    
    print("Initializing SHAP TextExplainer...")
    def predict_fn(texts):
        encodings = tokenizer(
            list(texts),
            max_length=256,
            padding=True,
            truncation=True,
            return_tensors='pt',
        )
        with torch.no_grad():
            logits = model(**encodings).logits
        return torch.nn.functional.softmax(logits, dim=-1).numpy()
    
    masker = shap.maskers.Text(tokenizer=tokenizer)
    text_explainer = shap.Explainer(predict_fn, masker)
    print("SHAP Explainer initialized!")
    
    yield
    # Cleanup if needed

app = FastAPI(title="Mental Health Signal Classifier API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    predictedClass: str
    confidences: dict
    tokens: list


@app.post("/api/classify", response_model=PredictionResponse)
def classify_text(req: TextRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model is still loading...")
        
    # Tokenize input
    inputs = tokenizer(req.text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    # Inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        
    # Calculate probabilities
    probabilities = torch.nn.functional.softmax(logits, dim=-1).squeeze().tolist()
    
    # If it's a single batch, probabilities might be a float if num_labels=1, but we have 5.
    if not isinstance(probabilities, list):
        probabilities = [probabilities]
        
    predicted_idx = int(torch.argmax(logits, dim=-1).item())
    predicted_class = LABEL_MAP[predicted_idx]
    
    confidences = {LABEL_MAP[i]: probabilities[i] for i in range(len(LABEL_MAP))}
    
    # SHAP Explainer
    try:
        # Run SHAP with max_evals=100 to ensure fast API response (<5s)
        shap_vals = text_explainer([req.text], max_evals=100)
        
        token_values = shap_vals.values[0, :, predicted_idx]
        tokens_list = shap_vals.data[0]
        
        token_attributions = [(tokens_list[i], float(token_values[i])) for i in range(len(tokens_list))]
        token_attributions.sort(key=lambda x: abs(x[1]), reverse=True)
        
        # Filter out special tokens and empty strings
        filtered_tokens = [t for t in token_attributions if t[0].strip() and t[0] not in ('[CLS]', '[SEP]')]
        
        # Take top 10
        top_tokens = [{"token": t[0], "value": t[1]} for t in filtered_tokens[:10]]
    except Exception as e:
        print(f"SHAP error: {e}")
        top_tokens = []
        
    return {
        "predictedClass": predicted_class,
        "confidences": confidences,
        "tokens": top_tokens 
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
