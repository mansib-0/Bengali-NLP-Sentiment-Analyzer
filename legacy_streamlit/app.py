import streamlit as st
from transformers import pipeline

st.set_page_config(page_title="Bengali NLP Sentiment Analyzer", page_icon="🇧🇩", layout="centered")

st.title("🇧🇩 Bengali NLP Sentiment Analyzer")
st.write("This application analyzes the sentiment of Bengali text (Positive, Negative, or Neutral).")

@st.cache_resource
def load_model():
    # Using a pre-trained multilingual sentiment analysis model that works well with Bengali
    # We use a lightweight distilled model to ensure it runs efficiently on standard hardware.
    sentiment_pipeline = pipeline("sentiment-analysis", model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")
    return sentiment_pipeline

with st.spinner("Loading NLP Model... Please wait (this may take a moment on the first run)."):
    try:
        analyzer = load_model()
    except Exception as e:
        st.error(f"Error loading model: {e}")
        st.stop()

# Text input
user_input = st.text_area("Enter Bengali Text here:", placeholder="যেমন: আমি এই বইটি পড়ে খুব আনন্দ পেয়েছি।")

if st.button("Analyze Sentiment"):
    if user_input.strip() == "":
        st.warning("Please enter some text to analyze.")
    else:
        with st.spinner("Analyzing..."):
            try:
                # The model outputs labels like 'positive', 'negative', 'neutral'
                result = analyzer(user_input)[0]
                label = result['label'].lower()
                score = result['score']
                
                # Map to Bengali/English user-friendly outputs
                if label == 'positive':
                    st.success(f"**Sentiment:** Positive 😊 (Confidence: {score:.2%})")
                elif label == 'negative':
                    st.error(f"**Sentiment:** Negative 😞 (Confidence: {score:.2%})")
                else:
                    st.info(f"**Sentiment:** Neutral 😐 (Confidence: {score:.2%})")
                    
            except Exception as e:
                st.error(f"An error occurred during analysis: {e}")

st.markdown("---")
st.markdown("*Developed with ❤️ using HuggingFace Transformers & Streamlit.*")
