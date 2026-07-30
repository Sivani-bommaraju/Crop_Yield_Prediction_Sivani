from fastapi import APIRouter, Depends, HTTPException

from app.schemas.farmer_schema import FarmerProfile
from app.auth.dependencies import get_current_user
from app.services.farmer_service import (
    save_farmer_profile,
    get_farmer_profile,
)

router = APIRouter(
    prefix="/farmer",
    tags=["Farmer"]
)


@router.put("/profile")
def save_profile(
    profile: FarmerProfile,
    current_user=Depends(get_current_user)
):
    return save_farmer_profile(
        current_user["user_id"],
        profile
    )


@router.get("/profile")
def read_profile(
    current_user=Depends(get_current_user)
):
    farmer = get_farmer_profile(
        current_user["user_id"]
    )

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return farmer