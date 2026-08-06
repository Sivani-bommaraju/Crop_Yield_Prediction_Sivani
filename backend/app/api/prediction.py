from fastapi import APIRouter
from app.services.weather_service import analyze_weather
from app.services.soil_service import analyze_soil
from app.schemas.prediction_schema import (
    PredictionRequest,
    PredictionResponse,
)

import pandas as pd
import joblib
from pathlib import Path

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

# Load model once when the server starts
MODEL_PATH = Path(__file__).parent.parent / "models" / "yield_model.pkl"

model = joblib.load(MODEL_PATH)


@router.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict_crop_yield(data: PredictionRequest):

    input_df = pd.DataFrame([{
        "Crop": data.Crop,
        "Crop_Year": data.Crop_Year,
        "Season": data.Season,
        "State": data.State,
        "Annual_Rainfall": data.Annual_Rainfall,
        "Fertilizer": data.Fertilizer,
        "Pesticide": data.Pesticide,
        "Avg_Temperature": data.Avg_Temperature,
        "Max_Temperature": data.Max_Temperature,
        "Min_Temperature": data.Min_Temperature,
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "pH": data.pH
    }])

    prediction = model.predict(input_df)
    weather = analyze_weather(data.State)
    soil = analyze_soil(
    data.N,
    data.P,
    data.K,
    data.pH
)

    return PredictionResponse(
        predicted_yield=float(prediction[0]),
        weather=weather,
        soil=soil
    )

from pydantic import BaseModel


class WeatherResponse(BaseModel):
        average_temperature: float | None
        average_rainfall: float | None
        average_humidity: float | None
        rainfall_status: str
        temperature_status: str
        impact: str

class SoilResponse(BaseModel):
    nitrogen: str
    phosphorus: str
    potassium: str
    ph: str
    soil_score: int
    quality: str
    recommendation: str

class PredictionResponse(BaseModel):
    predicted_yield: float
    weather: WeatherResponse
    soil: SoilResponse