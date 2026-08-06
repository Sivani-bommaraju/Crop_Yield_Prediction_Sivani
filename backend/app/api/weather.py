from fastapi import APIRouter
from app.services.weather_service import analyze_weather

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


@router.get("/{state}")
def weather(state: str):
    return analyze_weather(state)