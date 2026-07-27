from datetime import datetime


def create_farmer_document(
    user_id,
    state,
    district,
    village,
    land_size,
    soil_type,
    irrigation,
    preferred_crops
):
    return {
        "user_id": user_id,
        "state": state,
        "district": district,
        "village": village,
        "land_size": land_size,
        "soil_type": soil_type,
        "irrigation": irrigation,
        "preferred_crops": preferred_crops,
        "created_at": datetime.utcnow()
    }