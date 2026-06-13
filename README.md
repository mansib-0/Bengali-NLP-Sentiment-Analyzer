# Bengali NLP Sentiment Analyzer

An AI-powered web application for analyzing the sentiment of Bengali text (Positive, Negative, Neutral). This project is built using Streamlit and HuggingFace Transformers.

## Features
- Interactive Web Interface powered by Streamlit.
- Uses `lxyuan/distilbert-base-multilingual-cased-sentiments-student`, a lightweight multilingual sentiment model optimized for performance and accuracy in languages including Bengali.
- Displays confidence scores for each prediction.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mansib-0/Bengali-NLP-Sentiment-Analyzer.git
cd Bengali-NLP-Sentiment-Analyzer
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the Streamlit application:
```bash
streamlit run app.py
```

The application will open in your default web browser at `http://localhost:8501`.
