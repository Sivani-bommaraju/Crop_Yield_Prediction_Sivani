from fastapi import APIRouter, Depends

from app.schemas.farmer_schema import FarmerProfile
from app.services.farmer_service import create_farmer_profile
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/farmer",
    tags=["Farmer"]
)


@router.post("/profile")
def create_profile(
    profile: FarmerProfile,
    current_user=Depends(get_current_user)
):

    farmer = create_farmer_profile(
        current_user["user_id"],
        profile
    )

    return {
        "message": "Farmer profile created successfully",
        "profile": farmer
    }