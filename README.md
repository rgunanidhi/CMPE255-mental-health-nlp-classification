# Mental Health & Crisis Signal Mining on Social Media

**Course:** CMPE 255 – Data Mining, Section 34, Spring 2026
**University:** San Jose State University

> Portfolio copy of our team project. Original repo:
> [NateyLB/CMPE255Project](https://github.com/NateyLB/CMPE255Project) ·
> Live demo: [cmpe-255-project.vercel.app](https://cmpe-255-project.vercel.app)
>
> **My contributions (ML Modeling Lead):** trained and tuned the Logistic
> Regression, Linear SVM, and XGBoost models (5-fold stratified CV, Bayesian
> hyperparameter search via Optuna); built and owned the shared evaluation
> module `utils/common.py` (common metrics, label mapping, fixed random seed)
> used by all four contributors; ran the stylistic-features leakage probe and
> the cross-source / out-of-distribution evaluation; produced the final model
> comparison and confusion-matrix analysis.

## Team Members

| Name | SJSU ID | Role |
|------|---------|------|
| Ravikumar Komandur Narayanan | 018265117 | NLP Feature Engineer |
| Nathan Howland | 014826357 | Deep Learning & Deployment |
| Gunanidhi Ramakrishnan | 019108284 | ML Modeling Lead |
| Jesigga Sigurdardottir | 019156826 | Data Engineer |

## Project Overview

This project investigates whether data mining and NLP techniques can reliably detect and classify mental health crisis signals from social media posts. We build a 7-class classification pipeline that categorizes statements as **Stress**, **Depression**, **Bipolar Disorder**, **Personality Disorder**, **Suicidal**, **Anxiety**, or **Normal**.

Four models are systematically compared:
- Logistic Regression (baseline)
- Linear SVM
- XGBoost
- Fine-tuned DistilBERT

LDA topic modeling surfaces interpretable latent themes, and SHAP values provide token-level explainability. A Streamlit web app provides a live demo interface.

## Results

| Model | Condition | Macro-F1 | Weighted F1 | ROC-AUC | Accuracy |
|---|---|---|---|---|---|
| DistilBERT-LoRA | fine-tuned | 0.7139 | 0.7617 | 0.9628 | 0.7578 |
| XGBoost | TF-IDF + engineered + LDA | 0.7033 | 0.7500 | 0.9582 | 0.7460 |
| Logistic Regression | no balancing | 0.6740 | 0.7242 | 0.9466 | 0.7223 |
| Linear SVM | no balancing | 0.6605 | 0.7141 | 0.9419 | 0.7129 |

A stylistic-features-only leakage probe scored macro-F1 **0.2183** (well below
the 0.40 threshold), confirming models learn lexical signal rather than
surface artifacts such as post length or punctuation density.

## Datasets

| Dataset | Size | Source |
|---------|------|--------|
| Sentiment Analysis for Mental Health | ~51,000 statements | [Kaggle](https://www.kaggle.com/datasets/suchintikasarkar/sentiment-analysis-for-mental-health) |

## Project Structure

```
├── LICENSE
├── README.md
├── notebooks/              # EDA, preprocessing, modeling, and evaluation notebooks
├── artifacts/              # Saved models, vectorizers, and metrics
├── backend/                # API serving the trained models
├── mental-health-client/   # Web demo client
├── Check In/               # Course milestone check-in materials
└── report/                 # Final project report (PDF)
```

## Setup

```bash
git clone https://github.com/rgunanidhi/CMPE255-mental-health-nlp-classification.git
cd CMPE255-mental-health-nlp-classification
pip install -r requirements.txt
```

## Tech Stack

- Python 3.10+, pandas, scikit-learn, XGBoost
- HuggingFace Transformers (DistilBERT)
- gensim (LDA), pyLDAvis
- SHAP
- Streamlit
