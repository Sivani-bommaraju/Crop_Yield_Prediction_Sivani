from app.database.database import db
from app.models.user_model import create_user_document
from app.auth.hashing import hash_password
from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token


users_collection = db["users"]


def create_user(user):
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return None

    hashed_password = hash_password(user.password)

    user_document = create_user_document(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )

    result = users_collection.insert_one(user_document)

    user_document["_id"] = str(result.inserted_id)

    return user_document


def authenticate_user(email, password):

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        return None

    if not verify_password(
        password,
        user["password_hash"]
    ):
        return None


    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })


    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"]
    }




from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token


def authenticate_user(email: str, password: str):

    user = users_collection.find_one({"email": email})

    if user is None:
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"]
        }
    }