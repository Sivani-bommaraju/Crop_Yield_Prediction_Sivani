import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

# -------------------------
# Load Dataset
# -------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "raw",
    "Crop_recommendation.csv"
)

df = pd.read_csv(DATA_PATH)

# -------------------------
# Features & Target
# -------------------------
X = df.drop("label", axis=1)
y = df["label"]

# -------------------------
# Train Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------
# Model
# -------------------------
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# -------------------------
# Evaluation
# -------------------------
predictions = model.predict(X_test)

print("=" * 50)
print("Accuracy")
print("=" * 50)

print(accuracy_score(y_test, predictions))

print("\nClassification Report\n")

print(classification_report(y_test, predictions))

print("\nConfusion Matrix\n")

print(confusion_matrix(y_test, predictions))

# -------------------------
# Save Model
# -------------------------
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(
    model,
    os.path.join(
        MODEL_DIR,
        "crop_recommendation_model.pkl"
    )
)

print("\nModel Saved Successfully!")