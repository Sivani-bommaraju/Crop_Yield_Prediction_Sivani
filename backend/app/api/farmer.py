from fastapi import APIRouter, Depends, HTTPException

from app.schemas.farmer_schema import FarmerProfile
from app.auth.dependencies import get_current_user

from app.services.farmer_recommendation_service import (
    get_farmer_crop_recommendations,
)

from app.services.farmer_service import (
    save_farmer_profile,
    get_farmer_profile,
)

from app.database.database import db


router = APIRouter(
    prefix="/farmer",
    tags=["Farmer"]
)



advisories = db["advisories"]

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


from app.auth.dependencies import get_current_user
from fastapi import Depends
@router.get("/advisories")
def get_advisories(
    current_user=Depends(get_current_user)
):

    advisories.update_many(
        {
            "farmer_id": current_user["user_id"],
            "status": "unread"
        },
        {
            "$set": {
                "status": "read"
            }
        }
    )

    data = advisories.find(
        {
            "farmer_id": current_user["user_id"]
        }
    )

    return [
        {
            "id": str(item["_id"]),
            "title": item["title"],
            "message": item["message"],
            "status": item["status"]
        }
        for item in data
    ]


@router.get("/recommendations")
def get_crop_recommendations(
    current_user=Depends(get_current_user)
):

    result = get_farmer_crop_recommendations(
        current_user["user_id"]
    )

    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result
        )

    return result