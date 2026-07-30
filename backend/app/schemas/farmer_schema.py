# from pydantic import BaseModel
# from typing import List


# class FarmerProfile(BaseModel):

#     # Personal
#     phone: str
#     age: int
#     gender: str

#     # Farm
#     farm_name: str
#     state: str
#     district: str
#     village: str
#     land_size: float

#     # Soil
#     soil_type: str
#     soil_ph: float
#     nitrogen: float
#     phosphorus: float
#     potassium: float
#     organic_carbon: float

#     # Water
#     irrigation: str
#     water_source: str
#     annual_rainfall: float

#     # Crop
#     primary_crop: str
#     secondary_crop: str
#     season: str
#     crop_rotation: str

#     # Equipment
#     tractor: bool
#     harvester: bool
#     seeder: bool
#     sprayer: bool
#     sensors: bool


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