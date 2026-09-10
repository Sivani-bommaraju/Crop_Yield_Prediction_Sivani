
from fastapi import APIRouter, HTTPException, Query, Depends

from app.services.analytics_service import get_analytics_dashboard
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/dashboard")
def analytics_dashboard(
    period: str = Query(
        "6 Months",
        description="Analytics period"
    ),
    current_user: dict = Depends(get_current_user)
):

    allowed_periods = [
        "6 Months",
        "1 Year",
        "3 Years"
    ]

    if period not in allowed_periods:
        raise HTTPException(
            status_code=400,
            detail="Invalid analytics period"
        )

    print(
        "[Analytics API] Authenticated user:",
        current_user
    )

    user_id = current_user.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user ID is missing"
        )

    try:

        result = get_analytics_dashboard(
            current_user=current_user,
            period=period
        )

        return result

    except HTTPException:
        raise

    except Exception as e:

        print(
            "[Analytics API] Analytics error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate analytics dashboard"
        )