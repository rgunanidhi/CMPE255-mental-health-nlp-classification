# Mental Health & Crisis Signal Mining on Social Media

**Course:** CMPE 255 – Data Mining, Section 34, Spring 2026
**University:** San Jose State University

## Team Members

| Name | SJSU ID | Role |
|------|---------|------|
| Ravikumar Komandur Narayanan | 018265117 | NLP Feature Engineer |
| Nathan Howland | 014826357 | Deep Learning & Deployment |
| Gunanidhi Ramakrishnan | 019108284 | ML Modeling Lead |
| Jesigga Sigurdardottir | 019156826 | Data Engineer |

## Project Overview

This project investigates whether data mining and NLP techniques can reliably detect and classify mental health crisis signals from Reddit posts. We build a multi-class classification pipeline that categorizes posts as **Depression**, **Anxiety**, **Suicidal Ideation**, or **Neutral/Control**.

Four models are systematically compared:
- Logistic Regression (baseline)
- Linear SVM
- XGBoost
- Fine-tuned DistilBERT

LDA topic modeling surfaces interpretable latent themes, and SHAP values provide token-level explainability. A Streamlit web app provides a live demo interface.

## Datasets

| Dataset | Size | Source |
|---------|------|--------|
| Sentiment Analysis for Mental Health | ~51,000 statements | [Kaggle](https://www.kaggle.com/datasets/suchintikasarkar/sentiment-analysis-for-mental-health) |

## Project Structure

```
├── LICENSE
├── README.md
├── notebooks/          # EDA and experiment notebooks
├── src/                # Source code for the pipeline
├── data/               # Data directory (not tracked)
├── models/             # Saved model artifacts
└── app/                # Streamlit demo application
```

## Setup

```bash
git clone https://github.com/NateyLB/CMPE255Project.git
cd CMPE255Project
pip install -r requirements.txt
```

## Tech Stack

- Python 3.10+, pandas, scikit-learn, XGBoost
- HuggingFace Transformers (DistilBERT)
- gensim (LDA), pyLDAvis
- SHAP
- Streamlit
