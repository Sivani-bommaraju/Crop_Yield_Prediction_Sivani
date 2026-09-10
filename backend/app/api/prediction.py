from fastapi import APIRouter, Header, HTTPException

from app.services.weather_service import analyze_weather
from app.services.soil_service import analyze_soil

from app.schemas.prediction_schema import (
    PredictionRequest,
    PredictionResponse,
)

from app.database.database import db
from app.auth.jwt_handler import verify_access_token

from datetime import datetime

import pandas as pd
import joblib
from pathlib import Path


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


# ============================================================
# DATABASE
# ============================================================

predictions = db["predictions"]


# ============================================================
# LOAD MODEL
# ============================================================

MODEL_PATH = "/ML/model/yield_model.pkl"

model = joblib.load(MODEL_PATH)


# ============================================================
# PREDICTION
# ============================================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict_crop_yield(
    data: PredictionRequest,
    authorization: str = Header(None)
):

    # ========================================================
    # AUTHENTICATION
    # ========================================================

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Access token missing"
        )

    # ========================================================
    # VERIFY JWT
    # ========================================================

    current_user = verify_access_token(token)

    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token"
        )

    user_id = current_user.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID missing from access token"
        )

    print(
        "Prediction authenticated user:",
        current_user
    )

    # ========================================================
    # MODEL INPUT
    # ========================================================

    input_df = pd.DataFrame([{

        "Crop":
            data.Crop,

        "Crop_Year":
            data.Crop_Year,

        "Season":
            data.Season,

        "State":
            data.State,

        "Annual_Rainfall":
            data.Annual_Rainfall,

        "Fertilizer":
            data.Fertilizer,

        "Pesticide":
            data.Pesticide,

        "Avg_Temperature":
            data.Avg_Temperature,

        "Max_Temperature":
            data.Max_Temperature,

        "Min_Temperature":
            data.Min_Temperature,

        "N":
            data.N,

        "P":
            data.P,

        "K":
            data.K,

        "pH":
            data.pH

    }])

    # ========================================================
    # PREDICT
    # ========================================================

    prediction = model.predict(
        input_df
    )

    predicted_yield = float(
        prediction[0]
    )

    # ========================================================
    # WEATHER ANALYSIS
    # ========================================================

    weather = analyze_weather(
        data.State
    )

    # ========================================================
    # SOIL ANALYSIS
    # ========================================================

    soil = analyze_soil(
        data.N,
        data.P,
        data.K,
        data.pH
    )

    # ========================================================
    # SAVE PREDICTION FOR ANALYTICS
    # ========================================================

    prediction_document = {

        # IMPORTANT
        # This connects prediction to logged-in farmer
        "user_id":
            user_id,

        # ====================================================
        # MAIN PREDICTION DATA
        # ====================================================

        "crop":
            data.Crop,

        "predicted_yield":
            predicted_yield,

        "season":
            data.Season,

        "state":
            data.State,

        "crop_year":
            data.Crop_Year,

        "created_at":
            datetime.utcnow(),

        # ====================================================
        # ORIGINAL INPUTS
        # ====================================================

        "inputs": {

            "Crop":
                data.Crop,

            "Crop_Year":
                data.Crop_Year,

            "Season":
                data.Season,

            "State":
                data.State,

            "Annual_Rainfall":
                data.Annual_Rainfall,

            "Fertilizer":
                data.Fertilizer,

            "Pesticide":
                data.Pesticide,

            "Avg_Temperature":
                data.Avg_Temperature,

            "Max_Temperature":
                data.Max_Temperature,

            "Min_Temperature":
                data.Min_Temperature,

            "N":
                data.N,

            "P":
                data.P,

            "K":
                data.K,

            "pH":
                data.pH

        },

        # ====================================================
        # ANALYSIS RESULTS
        # ====================================================

        "weather":
            weather,

        "soil":
            soil

    }

    # ========================================================
    # INSERT INTO MONGODB
    # ========================================================

    result = predictions.insert_one(
        prediction_document
    )

    print(
        "Prediction saved:",
        result.inserted_id
    )

    print(
        "Prediction user_id:",
        user_id
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return PredictionResponse(

        predicted_yield=
            predicted_yield,

        weather=
            weather,

        soil=
            soil

    )