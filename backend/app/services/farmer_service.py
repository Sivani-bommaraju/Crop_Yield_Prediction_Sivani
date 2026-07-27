from app.database.database import db
from app.models.farmer_model import create_farmer_document

farmers_collection = db["farmer_profiles"]


def create_farmer_profile(user_id, profile):

    document = create_farmer_document(
        user_id=user_id,
        state=profile.state,
        district=profile.district,
        village=profile.village,
        land_size=profile.land_size,
        soil_type=profile.soil_type,
        irrigation=profile.irrigation,
        preferred_crops=profile.preferred_crops
    )

    result = farmers_collection.insert_one(document)

    document["_id"] = str(result.inserted_id)

    return document