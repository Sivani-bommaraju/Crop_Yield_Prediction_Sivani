from bson import ObjectId
from app.database.database import db

users = db["users"]
predictions = db["predictions"]


def get_dashboard():

    return {
        "stats": {
            "farmers": users.count_documents({"role": "farmer"}),
            "officers": users.count_documents(
                {"role": "agricultural_officer"}
            ),
            "admins": users.count_documents(
                {"role": "admin"}
            ),
            "predictions": predictions.count_documents({})
        },

        "recent_users": [
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
            ).sort("created_at", -1).limit(5)
        ]
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
        {"_id": ObjectId(user_id)}
    )

    return result.deleted_count > 0


def update_role(user_id, role):

    result = users.update_one(

        {"_id": ObjectId(user_id)},

        {
            "$set": {
                "role": role
            }
        }

    )

    return result.modified_count > 0