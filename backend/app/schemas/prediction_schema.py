from pydantic import BaseModel


class PredictionRequest(BaseModel):
    Crop: str
    Crop_Year: int
    Season: str
    State: str

    Annual_Rainfall: float
    Fertilizer: float
    Pesticide: float

    Avg_Temperature: float
    Max_Temperature: float
    Min_Temperature: float

    N: float
    P: float
    K: float
    pH: float


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