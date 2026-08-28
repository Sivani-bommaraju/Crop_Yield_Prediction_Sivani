import pickle

from app.database.database import db
from datetime import datetime

predictions = db["predictions"]

model = None

def predict_yield(data):
    features = [
        data.crop,
        data.soil_type,
        data.land_size,
        data.rainfall,
        data.temperature,
        data.fertilizer,
        data.irrigation

    ]
    result = model.predict(
        [features]
    )
    prediction = {
    "crop": data.crop,
    "predicted_yield": float(result[0]),
    "season": getattr(data, "season", None),
    "created_at": datetime.utcnow(),
    "inputs": data.dict()
}
    predictions.insert_one(
        prediction
    )
    return prediction