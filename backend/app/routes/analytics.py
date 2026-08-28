from fastapi import APIRouter, HTTPException, Query, Header

from app.services.analytics_service import get_analytics_dashboard
from app.auth.jwt_handler import verify_access_token


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
    authorization: str = Header(None)
):

    # ============================================================
    # VALIDATE PERIOD
    # ============================================================

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

    # ============================================================
    # CHECK AUTHORIZATION HEADER
    # ============================================================

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )

    # ============================================================
    # EXTRACT TOKEN
    # ============================================================

    token = authorization.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Access token is missing"
        )

    # ============================================================
    # VERIFY JWT
    # ============================================================

    try:
        current_user = verify_access_token(token)
    except Exception as error:
        print("JWT verification error:", str(error))
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token"
        )

    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token"
        )

    # ============================================================
    # DEBUG
    # ============================================================

    print("========================================")
    print("Analytics JWT user:")
    print(current_user)
    print("Analytics JWT user type:")
    print(type(current_user))
    print("========================================")

    # ============================================================
    # GENERATE USER-SPECIFIC ANALYTICS
    # ============================================================

    try:

        result = get_analytics_dashboard(
            current_user=current_user,
            period=period
        )

        return result

    except ValueError as error:

        print(
            "Analytics validation error:",
            str(error)
        )

        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Analytics error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate analytics dashboard"
        )