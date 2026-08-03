from fastapi import APIRouter

from app.schemas.prediction_schema import PredictionRequest

from app.services.prediction_service import predict_yield



router = APIRouter(

    prefix="/prediction",

    tags=["Prediction"]

)




@router.post("/")
def create_prediction(
    data:PredictionRequest
):

    return predict_yield(data)