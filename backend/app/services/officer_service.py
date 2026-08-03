from app.database.database import db

users = db["users"]
farmers = db["farmer_profiles"]
advisories = db["advisories"]
predictions = db["predictions"]
field_visits = db["field_visits"]


def get_dashboard_stats():

    return {

        "farmers": users.count_documents({
        "role": "farmer"}),

        "advisories": advisories.count_documents(
            {
                "status": "unread"
            }
        ),

        "visits": field_visits.count_documents(
            {
                "status": "scheduled"
            }
        ),

        "predictions": predictions.count_documents({})
    }

def get_farmers():

    data = farmers.find({})

    farmer_list = []

    for farmer in data:

        user = users.find_one(
            {"_id": farmer["user_id"]}
        )

        farm = farmer.get("farm", {})
        soil = farmer.get("soil", {})
        crop = farmer.get("crop", {})

        crops = []

        if crop.get("primary_crop"):
            crops.append(crop["primary_crop"])

        if crop.get("secondary_crop"):
            crops.append(crop["secondary_crop"])

        farmer_list.append({

            "id": str(farmer["_id"]),
            "farmer_id": str(farmer["_id"]),
            "user_id": str(farmer["user_id"]),

            "name": user.get("full_name", "") if user else "",
            "email": user.get("email", "") if user else "",

            "state": farm.get("state"),
            "district": farm.get("district"),
            "village": farm.get("village"),
            "land_size": farm.get("land_size"),

            "soil_type": soil.get("soil_type"),

            "preferred_crops": crops

        })

    return farmer_list


def create_advisory(data, officer_id):

    advisory = {

        "farmer_id": data["farmer_id"],

        "officer_id": officer_id,

        "title": data["title"],

        "message": data["message"],

        "status": "unread"

    }

    result = advisories.insert_one(advisory)

    return {
        "message": "Advisory Sent Successfully",
        "advisory": {
            "id": str(result.inserted_id),
            "farmer_id": advisory["farmer_id"],
            "officer_id": str(officer_id),
            "title": advisory["title"],
            "message": advisory["message"],
            "status": advisory["status"]
        }
    }