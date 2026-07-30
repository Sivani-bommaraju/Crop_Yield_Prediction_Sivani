from datetime import datetime


def create_farmer_document(user_id, profile):

    return {

        "user_id": user_id,

        "personal": {
            "phone": profile.phone,
            "age": profile.age,
            "gender": profile.gender,
        },

        "farm": {
            "farm_name": profile.farm_name,
            "state": profile.state,
            "district": profile.district,
            "village": profile.village,
            "land_size": profile.land_size,
        },

        "soil": {
            "soil_type": profile.soil_type,
            "soil_ph": profile.soil_ph,
            "nitrogen": profile.nitrogen,
            "phosphorus": profile.phosphorus,
            "potassium": profile.potassium,
            "organic_carbon": profile.organic_carbon,
        },

        "water": {
            "irrigation": profile.irrigation,
            "water_source": profile.water_source,
            "annual_rainfall": profile.annual_rainfall,
        },

        "crop": {
            "primary_crop": profile.primary_crop,
            "secondary_crop": profile.secondary_crop,
            "season": profile.season,
            "crop_rotation": profile.crop_rotation,
        },

        "equipment": {
            "tractor": profile.tractor,
            "harvester": profile.harvester,
            "seeder": profile.seeder,
            "sprayer": profile.sprayer,
            "sensors": profile.sensors,
        },

        "updated_at": datetime.utcnow()
    }