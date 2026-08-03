from pydantic import BaseModel


class PredictionRequest(BaseModel):

    crop: str

    soil_type: str

    land_size: float

    rainfall: float

    temperature: float

    fertilizer: str

    irrigation: str