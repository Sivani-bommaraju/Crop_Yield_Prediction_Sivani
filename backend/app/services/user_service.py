from app.database.database import db
from app.models.user_model import create_user_document
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token


users_collection = db["users"]


# ============================================================
# CREATE USER
# ============================================================

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


# ============================================================
# AUTHENTICATE USER
# ============================================================

def authenticate_user(email: str, password: str):

    user = users_collection.find_one(
        {"email": email}
    )

    # --------------------------------------------------------
    # USER NOT FOUND
    # --------------------------------------------------------

    if user is None:
        return None

    # --------------------------------------------------------
    # INVALID PASSWORD
    # --------------------------------------------------------

    if not verify_password(
        password,
        user["password_hash"]
    ):
        return None

    # --------------------------------------------------------
    # USER ID
    # --------------------------------------------------------

    user_id = str(user["_id"])

    # --------------------------------------------------------
    # CREATE JWT
    #
    # IMPORTANT:
    # The user's MongoDB ID goes into the token.
    #
    # It MUST NOT contain Analytics values such as:
    # "6 Months"
    # "1 Year"
    # "3 Years"
    # --------------------------------------------------------

    token = create_access_token({
        "sub": user_id,
        "user_id": user_id,
        "id": user_id,
        "role": user["role"]
    })

    # --------------------------------------------------------
    # RETURN LOGIN RESPONSE
    # --------------------------------------------------------

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"]
        }
    }