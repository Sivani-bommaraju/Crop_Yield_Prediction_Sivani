from fastapi import APIRouter, HTTPException, status

from app.schemas.user_schema import UserRegister, UserLogin
from app.services.user_service import create_user, authenticate_user
from firebase_admin import auth as firebase_auth

from app.auth.firebase_admin import verify_google_token
from app.auth.jwt_handler import create_access_token
from app.database.database import db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister):

    created_user = create_user(user)

    if created_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return {
        "message": "User registered successfully",
        "user": {
            "id": created_user["_id"],
            "full_name": created_user["full_name"],
            "email": created_user["email"],
            "role": created_user["role"]
        }
    }


@router.post("/login")
def login(user: UserLogin):

    authenticated_user = authenticate_user(
        user.email,
        user.password
    )

    if authenticated_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return authenticated_user


@router.post("/google")
def google_login(data: dict):

    id_token = data.get("idToken")

    decoded = verify_google_token(id_token)

    print("DECODED:", decoded)

    if decoded is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google Token"
        )

    email = decoded["email"]
    name = decoded.get("name", "")
    uid = decoded["uid"]

    users = db["users"]

    user = users.find_one({"email": email})

    if user is None:

      users.insert_one({
        "firebase_uid": uid,
        "full_name": name,
        "email": email,
        "password_hash": None,
        "role": "farmer"
      })

      user = users.find_one({"email": email})

    token = create_access_token(
        {
            "user_id": str(user["_id"]),
            "email": user["email"]
        }
    )

    print("JWT:", token)

    return {
        "access_token": token,
        "user": {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"]
        }
    }