import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "crop_recommendation_model.pkl"
)
saved = joblib.load(MODEL_PATH)

model = saved["model"]
feature_columns = saved["feature_columns"]

def recommend_crop(data):

    if isinstance(data, dict):
        N = data["N"]
        P = data["P"]
        K = data["K"]
        temperature = data["temperature"]
        humidity = data["humidity"]
        ph = data["ph"]
        rainfall = data["rainfall"]

    else:
        N = data.N
        P = data.P
        K = data.K
        temperature = data.temperature
        humidity = data.humidity
        ph = data.ph
        rainfall = data.rainfall

    input_df = pd.DataFrame(
        [[
            N,
            P,
            K,
            temperature,
            humidity,
            ph,
            rainfall,
        ]],
        columns=feature_columns
    )

    probabilities = model.predict_proba(input_df)[0]

    classes = model.classes_

    results = sorted(
        zip(classes, probabilities),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {
            "crop": crop,
            "confidence": round(float(prob * 100), 2)
        }
        for crop, prob in results[:3]
    ]