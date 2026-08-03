from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.admin_service import *

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class RoleUpdate(BaseModel):
    role: str


@router.get("/dashboard")
def dashboard():

    return get_dashboard()


@router.get("/users")
def users():

    return get_all_users()


@router.patch("/users/{user_id}")
def change_role(
    user_id: str,
    body: RoleUpdate
):

    success = update_role(
        user_id,
        body.role
    )

    if not success:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Role updated"
    }


@router.delete("/users/{user_id}")
def remove_user(user_id: str):

    success = delete_user(user_id)

    if not success:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Deleted"
    }