from bson import ObjectId
from app.database.database import db


users = db["users"]
predictions = db["predictions"]
advisories = db["advisories"]



def get_dashboard():


    total_users = users.count_documents({})

    farmers = users.count_documents({
        "role": "farmer"
    })

    officers = users.count_documents({
        "role": "agricultural_officer"
    })

    admins = users.count_documents({
        "role": "admin"
    })


    total_predictions = predictions.count_documents({})


    average_yield_result = list(
        predictions.aggregate([
            {
                "$group": {
                    "_id": None,
                    "average": {
                        "$avg": "$predicted_yield"
                    }
                }
            }
        ])
    )


    average_yield = 0

    if average_yield_result:

        average_yield = round(
            average_yield_result[0]["average"],
            2
        )


    top_crops = list(
        predictions.aggregate([

            {
                "$group": {
                    "_id": "$Crop",
                    "count": {
                        "$sum": 1
                    }
                }
            },

            {
                "$sort": {
                    "count": -1
                }
            },

            {
                "$limit": 5
            }

        ])
    )


    top_crops = [
        {
            "crop": item["_id"],
            "count": item["count"]
        }

        for item in top_crops
        if item["_id"]
    ]


    total_advisories = advisories.count_documents({})

    unread_advisories = advisories.count_documents({
        "status": "unread"
    })



    recent_users = [

        {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user.get("created_at")
        }

        for user in users.find(
            {},
            {"password_hash": 0}
        )
        .sort("created_at", -1)
        .limit(5)

    ]


    return {

        "stats": {

            "total_users": total_users,

            "farmers": farmers,

            "officers": officers,

            "admins": admins,

            "predictions": total_predictions,

            "average_yield": average_yield,

            "advisories": total_advisories,

            "unread_advisories": unread_advisories,

        },


        "analytics": {

            "top_crops": top_crops

        },


        "recent_users": recent_users

    }



def get_all_users():

    return [

        {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"]
        }

        for user in users.find(
            {},
            {"password_hash": 0}
        )

    ]



def delete_user(user_id):

    result = users.delete_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    return result.deleted_count > 0



def update_role(user_id, role):

    result = users.update_one(

        {
            "_id": ObjectId(user_id)
        },

        {
            "$set": {
                "role": role
            }
        }

    )

    return result.modified_count > 0