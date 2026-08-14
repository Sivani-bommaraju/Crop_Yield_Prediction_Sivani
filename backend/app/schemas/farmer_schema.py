
from pydantic import BaseModel
from typing import Optional

class FarmerProfile(BaseModel):

    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

    farm_name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    land_size: Optional[float] = None

    soil_type: Optional[str] = None
    soil_ph: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    organic_carbon: Optional[float] = None

    irrigation: Optional[str] = None
    water_source: Optional[str] = None
    annual_rainfall: Optional[float] = None

    primary_crop: Optional[str] = None
    secondary_crop: Optional[str] = None
    season: Optional[str] = None
    crop_rotation: Optional[str] = None

    tractor: Optional[bool] = False
    harvester: Optional[bool] = False
    seeder: Optional[bool] = False
    sprayer: Optional[bool] = False
    sensors: Optional[bool] = False