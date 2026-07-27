from pydantic import BaseModel
from typing import List


class FarmerProfile(BaseModel):
    state: str
    district: str
    village: str

    land_size: float

    soil_type: str

    irrigation: str

    preferred_crops: List[str]