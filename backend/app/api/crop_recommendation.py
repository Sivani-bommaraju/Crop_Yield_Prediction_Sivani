from fastapi import APIRouter

from app.schemas.crop_recommendation_schema import (
    CropRecommendationRequest,
)

from app.services.crop_recommendation_service import (
    recommend_crop,
)

router = APIRouter(
    prefix="/crop-recommendation",
    tags=["Crop Recommendation"],
)


@router.post("/")
def crop_recommendation(
    request: CropRecommendationRequest,
):
    recommendations = recommend_crop(request)

    return {
        "recommendations": recommendations
    }