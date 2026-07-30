from app.database.database import db
from app.models.farmer_model import create_farmer_document

farmers_collection = db["farmer_profiles"]


def save_farmer_profile(user_id, profile):

    document = create_farmer_document(
        user_id=user_id,
        profile=profile
    )

    farmers_collection.update_one(
        {"user_id": user_id},
        {"$set": document},
        upsert=True
    )

    farmer = farmers_collection.find_one(
        {"user_id": user_id}
    )

    farmer["_id"] = str(farmer["_id"])

    return farmer


def get_farmer_profile(user_id):

    farmer = farmers_collection.find_one(
        {"user_id": user_id}
    )

    if farmer:

        farmer["_id"] = str(farmer["_id"])

    return farmer