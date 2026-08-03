from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.services.officer_service import (
    get_dashboard_stats,
    get_farmers,
    create_advisory
)

router = APIRouter(
    prefix="/officer",
    tags=["Officer"]
)


@router.get("/dashboard")
def dashboard():
    return get_dashboard_stats()


@router.get("/farmers")
def all_farmers():
    return get_farmers()


@router.post("/advisory")
def advisory(
    data: dict,
    current_user=Depends(get_current_user)
):
    return create_advisory(
        data,
        current_user["user_id"]
    )