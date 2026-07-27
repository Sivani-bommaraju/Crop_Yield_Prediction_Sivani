from fastapi import APIRouter, HTTPException, status

from app.schemas.user_schema import UserRegister, UserLogin
from app.services.user_service import create_user, authenticate_user

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