# Ai_services.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import re

# Helper function for text cleaning
def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Load trained model and vectorizer for prediction
try:
    vectorizer = joblib.load('tfidf_vectorizer.pkl')
    model = joblib.load('recommendation_model.pkl')
except Exception as e:
    vectorizer, model = None, None
    print("Warning: Model files not loaded, prediction endpoint will not work.", e)

def recommend_topic(description, threshold=0.5):
    if vectorizer is None or model is None:
        return None, None
    description_clean = clean_text(description)
    description_tfid = vectorizer.transform([description_clean])
    probabilities = model.predict_proba(description_tfid)[0]
    confidence = probabilities.max()
    topic = model.classes_[probabilities.argmax()]
    if confidence >= threshold:
        return topic, confidence
    else:
        return None, None

# Load dataset.csv once
DATASET_PATH = 'dataset.csv'
try:
    df_dataset = pd.read_csv(DATASET_PATH)
except Exception as e:
    print("Error loading dataset:", e)
    df_dataset = pd.DataFrame()

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Endpoint: Predict Topic from Description
@app.route("/predict_topic", methods=["POST"])
def predict_topic():
    data = request.json
    description = data.get("description", "")
    if not description:
        return jsonify({"error": "No description provided"}), 400

    topic, confidence = recommend_topic(description)
    if topic:
        return jsonify({"predicted_topic": topic, "confidence": confidence})
    else:
        return jsonify({"error": "No suitable topic found"}), 404

# Endpoint: Recommend Videos by Topic (from dataset.csv)
@app.route("/recommend_videos", methods=["GET"])
def recommend_videos():
    topic = request.args.get("topic", "").strip()
    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    # Filter videos whose Topic column matches the requested topic (case-insensitive)
    filtered_videos = df_dataset[df_dataset["Topic"].str.lower() == topic.lower()]
    if filtered_videos.empty:
        return jsonify([])  # Return empty list if no videos found

    # Ensure the Views column is numeric and drop rows with missing views
    filtered_videos["Views"] = pd.to_numeric(filtered_videos["Views"], errors='coerce')
    filtered_videos = filtered_videos.dropna(subset=["Views"])

    # Sort by views (highest first) and take the top 15 videos
    top_videos = filtered_videos.sort_values(by="Views", ascending=False).head(15)

    # Return selected columns (e.g., Title, URL, Views, Video ID)
    result = top_videos[["Title", "URL", "Views", "Video ID"]]
    return jsonify(result.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
