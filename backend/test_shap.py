import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from peft import PeftModel
import shap
import inspect
from peft import LoraConfig

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

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
base_model = DistilBertForSequenceClassification.from_pretrained(
    'distilbert-base-uncased',
    num_labels=len(LABEL_MAP),
    id2label=LABEL_MAP,
    label2id={v: k for k, v in LABEL_MAP.items()}
)
model = PeftModel.from_pretrained(base_model, "NathanSJSU01/distilBERT_mentalhealth_detection")
model.eval()

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

texts = ["I feel very anxious and scared right now."]
print("Running explainer...")
shap_vals = text_explainer(texts, max_evals=100)
print(shap_vals.shape)
print(shap_vals.data)
print(shap_vals.values.shape)
