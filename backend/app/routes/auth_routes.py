from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import LoginRequest
from app.services.user_service import authenticate_user


router = APIRouter()


@router.post("/login")
def login(user: LoginRequest):

    result = authenticate_user(
        user.email,
        user.password
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result