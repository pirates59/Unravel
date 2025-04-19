# Model Training Section FYP.py
import pandas as pd
import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Load and clean dataset
df = pd.read_csv('dataset.csv')

def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['Title'] = df['Title'].fillna("").apply(clean_text)
df['Description'] = df['Description'].fillna("No description available").apply(clean_text)
df['Type'] = df['Title'] + " " + df['Description']

# Prepare features and labels
X = df['Type']
y = df['Topic']

# Vectorize the text
vectorizer = TfidfVectorizer(max_features=10000, stop_words='english', ngram_range=(1,2))
X_tfid = vectorizer.fit_transform(X)

# Train the model
X_train, X_test, y_train, y_test = train_test_split(X_tfid, y, test_size=0.2, random_state=42, stratify=y)
model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1, class_weight='balanced')
model.fit(X_train, y_train)

# Save the vectorizer and model for use in Flask
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
joblib.dump(model, 'recommendation_model.pkl')
print("Model and vectorizer saved.")
