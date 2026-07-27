from fastapi import APIRouter
from app.database.database import client

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        client.admin.command("ping")
        return {
            "status": "success",
            "message": "MongoDB Connected Successfully"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


from app.auth.dependencies import get_current_user
from fastapi import Depends


@router.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {
        "message": "You are authenticated!",
        "user": current_user
    }