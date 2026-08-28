from datetime import datetime, timedelta
from statistics import mean
from pathlib import Path
from typing import Any
import re

import pandas as pd

from app.database.database import db

try:
    from bson import ObjectId
except Exception:
    ObjectId = None


# ============================================================
# DATABASE
# ============================================================

predictions = db["predictions"]
farmer_profiles = db["farmer_profiles"]
users = db["users"]


# ============================================================
# DATASET PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

CROP_DATA_FILE = DATA_DIR / "crop_yield_data.csv"
WEATHER_DATA_FILE = DATA_DIR / "state_weather_data.csv"
SOIL_DATA_FILE = DATA_DIR / "state_soil_data.csv"


# ============================================================
# GENERAL HELPERS
# ============================================================

def safe_number(value, default=0.0):
    try:
        if value is None:
            return default

        if isinstance(value, bool):
            return default

        if isinstance(value, str):
            value = value.strip()

            if not value:
                return default

            value = value.replace(",", "")

        number = float(value)

        if pd.isna(number):
            return default

        return number

    except (ValueError, TypeError, OverflowError):
        return default


def clean_text(value):
    if value is None:
        return ""

    return str(value).strip()


def normalize_text(value):
    return clean_text(value).lower()


def normalize_crop(value):
    return normalize_text(value)


def load_csv(path):
    try:
        if not path.exists():
            print(
                f"[Analytics] Dataset not found: {path}"
            )
            return pd.DataFrame()

        df = pd.read_csv(path)

        if df.empty:
            return df

        df.columns = [
            str(column).strip()
            for column in df.columns
        ]

        return df

    except Exception as error:
        print(
            f"[Analytics] Unable to load dataset "
            f"{path}: {error}"
        )

        return pd.DataFrame()


# ============================================================
# USER / JWT NORMALIZATION
# ============================================================

def as_dict(value):
    """
    Convert current_user into a normal dictionary.

    Supports:
        - dict
        - Pydantic v2
        - Pydantic v1
        - objects with __dict__
        - mapping-like JWT payloads
        - strings containing user id/email
    """

    if value is None:
        return {}


    # --------------------------------------------------------
    # Already a dictionary
    # --------------------------------------------------------

    if isinstance(value, dict):
        return value


    # --------------------------------------------------------
    # Pydantic v2
    # --------------------------------------------------------

    if hasattr(value, "model_dump"):
        try:
            result = value.model_dump()

            if isinstance(result, dict):
                return result

        except Exception:
            pass


    # --------------------------------------------------------
    # Pydantic v1
    # --------------------------------------------------------

    if hasattr(value, "dict"):
        try:
            result = value.dict()

            if isinstance(result, dict):
                return result

        except Exception:
            pass


    # --------------------------------------------------------
    # Object __dict__
    # --------------------------------------------------------

    if hasattr(value, "__dict__"):
        try:
            result = vars(value)

            if isinstance(result, dict) and result:
                return result

        except Exception:
            pass


    # --------------------------------------------------------
    # Mapping-like object
    # --------------------------------------------------------

    if hasattr(value, "get"):

        result = {}

        possible_fields = [
            "id",
            "_id",
            "user_id",
            "userId",
            "farmer_id",
            "farmerId",
            "profile_id",
            "profileId",
            "email",
            "user_email",
            "userEmail",
            "username",
            "user_name",
            "userName",
            "sub",
        ]

        for key in possible_fields:

            try:
                item = value.get(key)

                if item is not None:
                    result[key] = item

            except Exception:
                pass

        if result:
            return result


    # --------------------------------------------------------
    # String
    # --------------------------------------------------------

    if isinstance(value, str):

        text = value.strip()

        if not text:
            return {}

        if "@" in text:
            return {
                "email": text
            }

        return {
            "id": text,
            "user_id": text,
            "sub": text,
        }


    return {}


# ============================================================
# ID NORMALIZATION
# ============================================================

def add_id_value(collection, value):
    """
    Add original, string and ObjectId versions of an ID.
    """

    if value is None:
        return

    text = clean_text(value)

    if not text:
        return

    # Original value
    if value not in collection:
        collection.append(value)

    # String version
    if text not in collection:
        collection.append(text)

    # ObjectId version
    if ObjectId is not None:

        try:

            if ObjectId.is_valid(text):

                object_id = ObjectId(text)

                if object_id not in collection:
                    collection.append(object_id)

        except Exception:
            pass


# ============================================================
# RESOLVE AUTHENTICATED USER
# ============================================================

def resolve_authenticated_user(current_user):
    """
    Resolve the JWT identity into the actual MongoDB user.

    This is important because the JWT may contain:

        sub
        id
        user_id
        email

    while predictions are stored as:

        user_id: "6a6877865c304d0d14b9ee83"
    """

    user = as_dict(current_user)

    if not user:
        return {}


    print(
        "[Analytics] Raw authenticated user:",
        user
    )


    # --------------------------------------------------------
    # Collect identifiers from JWT
    # --------------------------------------------------------

    id_values = []

    for key in [
        "id",
        "_id",
        "user_id",
        "userId",
        "farmer_id",
        "farmerId",
        "profile_id",
        "profileId",
        "sub",
    ]:

        value = user.get(key)

        if value is not None:
            add_id_value(
                id_values,
                value
            )


    email_values = []

    for key in [
        "email",
        "user_email",
        "userEmail",
        "owner_email",
        "ownerEmail",
        "farmer_email",
        "farmerEmail",
    ]:

        value = user.get(key)

        if value is not None:

            email = normalize_text(value)

            if email and email not in email_values:
                email_values.append(email)


    username_values = []

    for key in [
        "username",
        "user_name",
        "userName",
    ]:

        value = user.get(key)

        if value is not None:

            username = normalize_text(value)

            if (
                username
                and username not in username_values
            ):
                username_values.append(username)


    # --------------------------------------------------------
    # If sub is an email, move it to email identifiers
    # --------------------------------------------------------

    for value in list(id_values):

        text = clean_text(value)

        if "@" in text:

            email = normalize_text(text)

            if email not in email_values:
                email_values.append(email)


    # --------------------------------------------------------
    # Build query against users collection
    # --------------------------------------------------------

    user_query_clauses = []


    for value in id_values:

        user_query_clauses.extend([
            {
                "_id": value
            },
            {
                "id": value
            },
            {
                "user_id": value
            },
            {
                "userId": value
            },
        ])


    for email in email_values:

        user_query_clauses.extend([
            {
                "email": {
                    "$regex": (
                        f"^{re.escape(email)}$"
                    ),
                    "$options": "i",
                }
            }
        ])


    for username in username_values:

        user_query_clauses.extend([
            {
                "username": {
                    "$regex": (
                        f"^{re.escape(username)}$"
                    ),
                    "$options": "i",
                }
            },
            {
                "user_name": {
                    "$regex": (
                        f"^{re.escape(username)}$"
                    ),
                    "$options": "i",
                }
            },
        ])


    resolved_user = None


    if user_query_clauses:

        try:

            resolved_user = users.find_one({
                "$or": user_query_clauses
            })

        except Exception as error:

            print(
                "[Analytics] User lookup error:",
                error
            )


    # --------------------------------------------------------
    # Build final identity
    # --------------------------------------------------------

    resolved_ids = list(id_values)

    resolved_emails = list(email_values)

    resolved_usernames = list(username_values)


    if resolved_user:

        print(
            "[Analytics] Resolved Mongo user:",
            resolved_user
        )


        for key in [
            "_id",
            "id",
            "user_id",
            "userId",
            "farmer_id",
            "farmerId",
        ]:

            value = resolved_user.get(key)

            if value is not None:

                add_id_value(
                    resolved_ids,
                    value
                )


        for key in [
            "email",
            "user_email",
            "userEmail",
        ]:

            value = resolved_user.get(key)

            if value:

                email = normalize_text(value)

                if email not in resolved_emails:
                    resolved_emails.append(email)


        for key in [
            "username",
            "user_name",
            "userName",
        ]:

            value = resolved_user.get(key)

            if value:

                username = normalize_text(value)

                if username not in resolved_usernames:
                    resolved_usernames.append(username)


    return {
        "user": user,
        "mongo_user": resolved_user,
        "ids": resolved_ids,
        "emails": resolved_emails,
        "usernames": resolved_usernames,
    }


# ============================================================
# OWNER QUERY
# ============================================================

def build_owner_query(current_user):
    """
    Build a MongoDB query matching ONLY the authenticated user.

    Your prediction document currently contains:

        user_id: "6a6877865c304d0d14b9ee83"

    so this function explicitly supports that format.
    """

    identity = resolve_authenticated_user(
        current_user
    )

    if not identity:
        return None


    clauses = []


    # --------------------------------------------------------
    # ID fields
    # --------------------------------------------------------

    id_fields = [
        "user_id",
        "userId",
        "owner_id",
        "ownerId",
        "farmer_id",
        "farmerId",
        "profile_id",
        "profileId",
        "created_by",
        "createdBy",
    ]


    for field in id_fields:

        for value in identity["ids"]:

            clauses.append({
                field: value
            })


    # --------------------------------------------------------
    # Email fields
    # --------------------------------------------------------

    email_fields = [
        "email",
        "user_email",
        "userEmail",
        "owner_email",
        "ownerEmail",
        "farmer_email",
        "farmerEmail",
    ]


    for field in email_fields:

        for email in identity["emails"]:

            clauses.append({
                field: {
                    "$regex": (
                        f"^{re.escape(email)}$"
                    ),
                    "$options": "i",
                }
            })


    # --------------------------------------------------------
    # Username fields
    # --------------------------------------------------------

    username_fields = [
        "username",
        "user_name",
        "userName",
        "owner_username",
        "farmer_username",
    ]


    for field in username_fields:

        for username in identity["usernames"]:

            clauses.append({
                field: {
                    "$regex": (
                        f"^{re.escape(username)}$"
                    ),
                    "$options": "i",
                }
            })


    if not clauses:
        return None


    return {
        "$or": clauses
    }


# ============================================================
# FARMER PROFILE
# ============================================================

def get_farmer_profile(current_user):

    owner_query = build_owner_query(
        current_user
    )

    if not owner_query:

        print(
            "[Analytics] Could not build farmer "
            "profile owner query."
        )

        return {}


    # --------------------------------------------------------
    # Direct lookup
    # --------------------------------------------------------

    try:

        profile = farmer_profiles.find_one(
            owner_query
        )

        if profile:

            print(
                "[Analytics] Farmer profile found."
            )

            return profile

    except Exception as error:

        print(
            "[Analytics] Farmer profile lookup error:",
            error
        )


    # --------------------------------------------------------
    # Resolve user first
    # --------------------------------------------------------

    identity = resolve_authenticated_user(
        current_user
    )

    if not identity:
        return {}


    # --------------------------------------------------------
    # Search profile using resolved user IDs
    # --------------------------------------------------------

    profile_clauses = []


    for value in identity["ids"]:

        profile_clauses.extend([
            {
                "user_id": value
            },
            {
                "userId": value
            },
            {
                "owner_id": value
            },
            {
                "ownerId": value
            },
            {
                "farmer_id": value
            },
            {
                "farmerId": value
            },
        ])


    for email in identity["emails"]:

        profile_clauses.append({
            "email": {
                "$regex": (
                    f"^{re.escape(email)}$"
                ),
                "$options": "i",
            }
        })


    if profile_clauses:

        try:

            profile = farmer_profiles.find_one({
                "$or": profile_clauses
            })

            if profile:
                return profile

        except Exception as error:

            print(
                "[Analytics] Profile resolution error:",
                error
            )


    return {}


# ============================================================
# FARMER STATE
# ============================================================

def get_farmer_state(profile):

    state = profile.get("state")

    if state:
        return clean_text(state)


    farm = profile.get(
        "farm",
        {}
    )

    if isinstance(farm, dict):

        state = farm.get("state")

        if state:
            return clean_text(state)


    location = profile.get(
        "location",
        {}
    )

    if isinstance(location, dict):

        state = location.get("state")

        if state:
            return clean_text(state)


    return ""


# ============================================================
# FARMER PRIMARY CROP
# ============================================================

def get_farmer_crop(profile):

    preferred_crops = profile.get(
        "preferred_crops"
    )

    if isinstance(
        preferred_crops,
        list
    ):

        for crop in preferred_crops:

            crop_name = clean_text(crop)

            if crop_name:
                return crop_name


    crop = profile.get(
        "crop",
        {}
    )

    if isinstance(crop, dict):

        primary_crop = clean_text(
            crop.get("primary_crop")
        )

        if primary_crop:
            return primary_crop


    primary_crop = clean_text(
        profile.get("primary_crop")
    )

    if primary_crop:
        return primary_crop


    return ""


# ============================================================
# PREDICTION HELPERS
# ============================================================

def get_prediction_yield(document):

    possible_keys = [
        "predicted_yield",
        "yield_prediction",
        "predictedYield",
        "prediction",
        "predicted",
        "yield",
    ]


    for key in possible_keys:

        value = document.get(key)

        if value is None:
            continue

        number = safe_number(
            value
        )

        if number != 0:
            return number


    return 0.0


def get_prediction_crop(document):

    possible_keys = [
        "crop",
        "Crop",
        "crop_name",
        "cropName",
    ]


    for key in possible_keys:

        value = document.get(key)

        if value is None:
            continue

        crop = clean_text(value)

        if crop:
            return crop


    return ""


def get_prediction_season(document):

    possible_keys = [
        "season",
        "Season",
        "crop_season",
        "cropSeason",
    ]


    for key in possible_keys:

        value = document.get(key)

        if value is None:
            continue

        season = clean_text(value)

        if season:
            return season


    return ""


# ============================================================
# PREDICTION DATE
# ============================================================

def parse_prediction_date(document):

    possible_keys = [
        "created_at",
        "createdAt",
        "timestamp",
        "date",
        "prediction_date",
        "predictionDate",
    ]


    value = None


    for key in possible_keys:

        if document.get(key) is not None:

            value = document.get(key)

            break


    if not value:
        return None


    if isinstance(
        value,
        datetime
    ):

        if value.tzinfo:

            return value.replace(
                tzinfo=None
            )

        return value


    if isinstance(
        value,
        str
    ):

        try:

            parsed = datetime.fromisoformat(
                value.replace(
                    "Z",
                    "+00:00"
                )
            )

            if parsed.tzinfo:

                parsed = parsed.replace(
                    tzinfo=None
                )

            return parsed

        except ValueError:
            return None


    return None


# ============================================================
# DATE RANGE
# ============================================================

def get_date_range(period):

    now = datetime.utcnow()


    if period == "6 Months":

        start = now - timedelta(
            days=180
        )


    elif period == "1 Year":

        start = now - timedelta(
            days=365
        )


    elif period == "3 Years":

        start = now - timedelta(
            days=1095
        )


    else:

        start = now - timedelta(
            days=180
        )


    return start, now


# ============================================================
# USER-SCOPED PREDICTIONS
# ============================================================

def get_prediction_documents(
    current_user,
    start_date=None,
    end_date=None,
    crop=None,
):

    owner_query = build_owner_query(
        current_user
    )


    if not owner_query:

        print(
            "[Analytics] Prediction query skipped: "
            "no authenticated owner."
        )

        return []


    clauses = [
        owner_query
    ]


    # --------------------------------------------------------
    # DATE FILTER
    # --------------------------------------------------------

    if (
        start_date is not None
        and end_date is not None
    ):

        date_clauses = []


        for field in [
            "created_at",
            "createdAt",
            "timestamp",
            "date",
            "prediction_date",
            "predictionDate",
        ]:

            date_clauses.append({
                field: {
                    "$gte": start_date,
                    "$lte": end_date,
                }
            })


        clauses.append({
            "$or": date_clauses
        })


    # --------------------------------------------------------
    # CROP FILTER
    # --------------------------------------------------------

    if crop:

        crop_name = clean_text(
            crop
        )

        crop_pattern = (
            f"^{re.escape(crop_name)}$"
        )


        clauses.append({
            "$or": [
                {
                    "crop": {
                        "$regex": crop_pattern,
                        "$options": "i",
                    }
                },
                {
                    "Crop": {
                        "$regex": crop_pattern,
                        "$options": "i",
                    }
                },
            ]
        })


    query = {
        "$and": clauses
    }


    # --------------------------------------------------------
    # DEBUG QUERY
    # --------------------------------------------------------

    print(
        "[Analytics] Prediction owner query:",
        owner_query
    )

    print(
        "[Analytics] Prediction crop filter:",
        crop
    )


    # --------------------------------------------------------
    # EXECUTE
    # --------------------------------------------------------

    try:

        documents = list(
            predictions.find(
                query
            )
        )


        documents.sort(
            key=lambda document: (
                parse_prediction_date(
                    document
                )
                or datetime.min
            )
        )


        print(
            "[Analytics] Predictions found:",
            len(documents)
        )


        # ----------------------------------------------------
        # IMPORTANT DEBUG
        # ----------------------------------------------------

        for document in documents:

            print(
                "[Analytics] Prediction:",
                {
                    "user_id": document.get(
                        "user_id"
                    ),
                    "crop": get_prediction_crop(
                        document
                    ),
                    "yield": get_prediction_yield(
                        document
                    ),
                    "created_at": document.get(
                        "created_at"
                    ),
                }
            )


        return documents


    except Exception as error:

        print(
            "[Analytics] Prediction query error:",
            error
        )

        return []


# ============================================================
# HISTORICAL CROP DATA
# ============================================================

def get_historical_crop_data(profile):

    df = load_csv(
        CROP_DATA_FILE
    )


    if df.empty:
        return df


    state = get_farmer_state(
        profile
    )

    crop = get_farmer_crop(
        profile
    )


    # --------------------------------------------------------
    # STATE FILTER
    # --------------------------------------------------------

    if (
        state
        and "State" in df.columns
    ):

        state_mask = (
            df["State"]
            .astype(str)
            .str.strip()
            .str.lower()
            == state.lower()
        )


        state_data = df[
            state_mask
        ]


        if not state_data.empty:
            df = state_data


    # --------------------------------------------------------
    # CROP FILTER
    # --------------------------------------------------------

    if (
        crop
        and "Crop" in df.columns
    ):

        crop_mask = (
            df["Crop"]
            .astype(str)
            .str.strip()
            .str.lower()
            == crop.lower()
        )


        crop_data = df[
            crop_mask
        ]


        if not crop_data.empty:
            df = crop_data


    return df


# ============================================================
# HISTORICAL BENCHMARK
# ============================================================

def get_yield_benchmark(profile):

    df = get_historical_crop_data(
        profile
    )


    if (
        df.empty
        or "Yield" not in df.columns
    ):
        return 0


    values = pd.to_numeric(
        df["Yield"],
        errors="coerce"
    ).dropna()


    if values.empty:
        return 0


    return round(
        values.mean(),
        2
    )


# ============================================================
# HISTORICAL SEASONAL PERFORMANCE
# ============================================================

def get_seasonal_performance(profile):

    df = get_historical_crop_data(
        profile
    )


    if (
        df.empty
        or "Season" not in df.columns
        or "Yield" not in df.columns
    ):
        return []


    df = df.copy()


    df["Yield"] = pd.to_numeric(
        df["Yield"],
        errors="coerce"
    )


    df = df.dropna(
        subset=["Yield"]
    )


    if df.empty:
        return []


    df["Season"] = (
        df["Season"]
        .astype(str)
        .str.strip()
    )


    grouped = (
        df.groupby("Season")["Yield"]
        .mean()
        .sort_values(
            ascending=False
        )
    )


    return [
        {
            "season": clean_text(
                season
            ),
            "yield": round(
                safe_number(value),
                2
            ),
        }
        for season, value
        in grouped.items()
    ]


# ============================================================
# HISTORICAL YIELD TREND
# ============================================================

def get_historical_yield_trend(profile):

    df = get_historical_crop_data(
        profile
    )


    if (
        df.empty
        or "Crop_Year" not in df.columns
        or "Yield" not in df.columns
    ):
        return []


    df = df.copy()


    df["Crop_Year"] = pd.to_numeric(
        df["Crop_Year"],
        errors="coerce"
    )


    df["Yield"] = pd.to_numeric(
        df["Yield"],
        errors="coerce"
    )


    df = df.dropna(
        subset=[
            "Crop_Year",
            "Yield",
        ]
    )


    if df.empty:
        return []


    grouped = (
        df.groupby("Crop_Year")["Yield"]
        .mean()
        .sort_index()
    )


    return [
        {
            "year": str(
                int(year)
            ),
            "yield": round(
                safe_number(value),
                2
            ),
            "actual": round(
                safe_number(value),
                2
            ),
        }
        for year, value
        in grouped.items()
    ]


# ============================================================
# WEATHER ANALYSIS
# ============================================================

def get_weather_analysis(profile):

    df = load_csv(
        WEATHER_DATA_FILE
    )


    if df.empty:

        return {
            "available": False,
            "average_temperature": 0,
            "average_rainfall": 0,
            "average_humidity": 0,
            "rainfall_status": "Unavailable",
            "temperature_status": "Unavailable",
        }


    state = get_farmer_state(
        profile
    )


    if (
        state
        and "state" in df.columns
    ):

        filtered = df[
            df["state"]
            .astype(str)
            .str.strip()
            .str.lower()
            == state.lower()
        ]


        if not filtered.empty:
            df = filtered


    temperature_column = (
        "avg_temp_c"
        if "avg_temp_c" in df.columns
        else None
    )


    rainfall_column = (
        "total_rainfall_mm"
        if "total_rainfall_mm" in df.columns
        else None
    )


    humidity_column = (
        "avg_humidity_percent"
        if "avg_humidity_percent" in df.columns
        else None
    )


    temperature = 0
    rainfall = 0
    humidity = 0


    # --------------------------------------------------------
    # Temperature
    # --------------------------------------------------------

    if temperature_column:

        values = pd.to_numeric(
            df[temperature_column],
            errors="coerce"
        ).dropna()


        if not values.empty:

            temperature = round(
                values.mean(),
                2
            )


    # --------------------------------------------------------
    # Rainfall
    # --------------------------------------------------------

    if rainfall_column:

        values = pd.to_numeric(
            df[rainfall_column],
            errors="coerce"
        ).dropna()


        if not values.empty:

            rainfall = round(
                values.mean(),
                2
            )


    # --------------------------------------------------------
    # Humidity
    # --------------------------------------------------------

    if humidity_column:

        values = pd.to_numeric(
            df[humidity_column],
            errors="coerce"
        ).dropna()


        if not values.empty:

            humidity = round(
                values.mean(),
                2
            )


    # --------------------------------------------------------
    # Rainfall status
    # --------------------------------------------------------

    if rainfall <= 0:

        rainfall_status = (
            "Unavailable"
        )

    elif rainfall < 700:

        rainfall_status = (
            "Low Rainfall"
        )

    elif rainfall > 2500:

        rainfall_status = (
            "High Rainfall"
        )

    else:

        rainfall_status = (
            "Normal Rainfall"
        )


    # --------------------------------------------------------
    # Temperature status
    # --------------------------------------------------------

    if temperature <= 0:

        temperature_status = (
            "Unavailable"
        )

    elif 20 <= temperature <= 32:

        temperature_status = (
            "Optimal Temperature"
        )

    elif temperature < 20:

        temperature_status = (
            "Low Temperature"
        )

    else:

        temperature_status = (
            "High Temperature"
        )


    return {
        "available": True,
        "average_temperature": temperature,
        "average_rainfall": rainfall,
        "average_humidity": humidity,
        "rainfall_status": rainfall_status,
        "temperature_status": temperature_status,
    }


# ============================================================
# SOIL SCORE
# ============================================================

def calculate_soil_score(
    nitrogen,
    phosphorus,
    potassium,
    ph,
):

    score = 100


    if nitrogen < 40:
        score -= 20

    elif nitrogen < 60:
        score -= 10


    if phosphorus < 20:
        score -= 15

    elif phosphorus < 40:
        score -= 8


    if potassium < 30:
        score -= 15

    elif potassium < 50:
        score -= 8


    if ph < 5.5 or ph > 8:
        score -= 20

    elif ph < 6 or ph > 7.5:
        score -= 10


    score = max(
        0,
        min(
            100,
            score
        )
    )


    if score >= 75:

        quality = "Excellent"

    elif score >= 60:

        quality = "Good"

    elif score >= 40:

        quality = "Moderate"

    else:

        quality = "Poor"


    return score, quality


# ============================================================
# SOIL ANALYSIS
# ============================================================

def get_soil_analysis(profile):

    soil = profile.get(
        "soil",
        {}
    )


    if not isinstance(
        soil,
        dict
    ):
        soil = {}


    own_n = soil.get(
        "nitrogen"
    )

    own_p = soil.get(
        "phosphorus"
    )

    own_k = soil.get(
        "potassium"
    )

    own_ph = soil.get(
        "soil_ph",
        soil.get("pH")
    )


    has_own_soil = any(
        value is not None
        and clean_text(value) != ""
        for value in [
            own_n,
            own_p,
            own_k,
            own_ph,
        ]
    )


    # --------------------------------------------------------
    # Farmer profile soil
    # --------------------------------------------------------

    if has_own_soil:

        nitrogen = safe_number(
            own_n
        )

        phosphorus = safe_number(
            own_p
        )

        potassium = safe_number(
            own_k
        )

        ph = safe_number(
            own_ph
        )


        score, quality = (
            calculate_soil_score(
                nitrogen,
                phosphorus,
                potassium,
                ph,
            )
        )


        return {
            "available": True,
            "source": "farmer_profile",
            "nitrogen": round(
                nitrogen,
                2
            ),
            "phosphorus": round(
                phosphorus,
                2
            ),
            "potassium": round(
                potassium,
                2
            ),
            "ph": round(
                ph,
                2
            ),
            "soil_score": score,
            "quality": quality,
        }


    # --------------------------------------------------------
    # State soil dataset
    # --------------------------------------------------------

    df = load_csv(
        SOIL_DATA_FILE
    )


    if df.empty:

        return {
            "available": False,
            "source": "unavailable",
            "nitrogen": 0,
            "phosphorus": 0,
            "potassium": 0,
            "ph": 0,
            "soil_score": 0,
            "quality": "Unknown",
        }


    state = get_farmer_state(
        profile
    )


    if (
        state
        and "state" in df.columns
    ):

        filtered = df[
            df["state"]
            .astype(str)
            .str.strip()
            .str.lower()
            == state.lower()
        ]


        if not filtered.empty:
            df = filtered


    values = {}


    for key, column in {
        "N": "N",
        "P": "P",
        "K": "K",
        "pH": "pH",
    }.items():

        if column in df.columns:

            numeric = pd.to_numeric(
                df[column],
                errors="coerce"
            ).dropna()


            if not numeric.empty:

                values[key] = round(
                    numeric.mean(),
                    2
                )

            else:

                values[key] = 0

        else:

            values[key] = 0


    nitrogen = values["N"]
    phosphorus = values["P"]
    potassium = values["K"]
    ph = values["pH"]


    score, quality = (
        calculate_soil_score(
            nitrogen,
            phosphorus,
            potassium,
            ph,
        )
    )


    return {
        "available": True,
        "source": "state_dataset",
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium,
        "ph": ph,
        "soil_score": score,
        "quality": quality,
    }


# ============================================================
# CROP PERFORMANCE FROM PREDICTIONS
# ============================================================

def get_predicted_crop_performance(
    current_user,
    start_date,
    end_date,
):

    documents = get_prediction_documents(
        current_user,
        start_date,
        end_date,
    )


    crop_values = {}


    for document in documents:

        crop = get_prediction_crop(
            document
        )

        value = get_prediction_yield(
            document
        )


        if (
            not crop
            or value <= 0
        ):
            continue


        normalized = normalize_crop(
            crop
        )


        if normalized not in crop_values:

            crop_values[normalized] = {
                "crop": crop,
                "values": [],
            }


        crop_values[
            normalized
        ]["values"].append(
            value
        )


    results = []


    for item in crop_values.values():

        values = item["values"]


        if not values:
            continue


        results.append({
            "crop": item["crop"],
            "yield": round(
                mean(values),
                2
            ),
        })


    results.sort(
        key=lambda item: safe_number(
            item.get("yield")
        ),
        reverse=True
    )


    return results


# ============================================================
# PREDICTION HISTORY
# ============================================================

def get_prediction_history(
    current_user,
    start_date,
    end_date,
):

    documents = get_prediction_documents(
        current_user,
        start_date,
        end_date,
    )


    yearly_values = {}


    for document in documents:

        value = get_prediction_yield(
            document
        )


        if value <= 0:
            continue


        created_at = parse_prediction_date(
            document
        )


        if not created_at:
            continue


        year = str(
            created_at.year
        )


        yearly_values.setdefault(
            year,
            []
        ).append(
            value
        )


    results = []


    for year in sorted(
        yearly_values.keys()
    ):

        values = yearly_values[
            year
        ]


        average = round(
            mean(values),
            2
        )


        results.append({
            "year": year,
            "yield": average,
            "predicted": average,
        })


    return results


# ============================================================
# COMBINED YIELD TREND
# ============================================================

def get_yield_trend(
    current_user,
    profile,
    start_date,
    end_date,
):

    historical = (
        get_historical_yield_trend(
            profile
        )
    )


    predictions_history = (
        get_prediction_history(
            current_user,
            start_date,
            end_date,
        )
    )


    combined = {}


    # --------------------------------------------------------
    # Historical
    # --------------------------------------------------------

    for item in historical:

        year = item["year"]


        combined.setdefault(
            year,
            {}
        )


        combined[year][
            "actual"
        ] = item["actual"]


        combined[year][
            "yield"
        ] = item["actual"]


    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    for item in predictions_history:

        year = item["year"]


        combined.setdefault(
            year,
            {}
        )


        combined[year][
            "predicted"
        ] = item["predicted"]


        if "actual" not in combined[year]:

            combined[year][
                "yield"
            ] = item["predicted"]


    results = []


    for year in sorted(
        combined.keys()
    ):

        item = combined[
            year
        ]


        result = {
            "year": year,
            "yield": round(
                safe_number(
                    item.get("yield")
                ),
                2
            ),
        }


        if "actual" in item:

            result["actual"] = round(
                safe_number(
                    item["actual"]
                ),
                2
            )


        if "predicted" in item:

            result["predicted"] = round(
                safe_number(
                    item["predicted"]
                ),
                2
            )


        results.append(
            result
        )


    return results


# ============================================================
# WEATHER IMPACT
# ============================================================

def get_weather_impact(
    weather,
    soil,
):

    if not weather.get(
        "available"
    ):

        return [
            {
                "factor": "Rainfall",
                "impact": 0,
            },
            {
                "factor": "Temperature",
                "impact": 0,
            },
            {
                "factor": "Humidity",
                "impact": 0,
            },
            {
                "factor": "Soil Moisture",
                "impact": 0,
            },
        ]


    rainfall = safe_number(
        weather.get(
            "average_rainfall"
        )
    )


    temperature = safe_number(
        weather.get(
            "average_temperature"
        )
    )


    humidity = safe_number(
        weather.get(
            "average_humidity"
        )
    )


    soil_score = safe_number(
        soil.get(
            "soil_score"
        )
    )


    rainfall_impact = max(
        0,
        100
        - abs(
            rainfall - 1200
        ) / 12
    )


    temperature_impact = max(
        0,
        100
        - abs(
            temperature - 27
        ) * 7
    )


    humidity_impact = max(
        0,
        100
        - abs(
            humidity - 70
        ) * 2
    )


    soil_moisture = (
        rainfall_impact * 0.6
        + soil_score * 0.4
    )


    return [
        {
            "factor": "Rainfall",
            "impact": round(
                min(
                    100,
                    rainfall_impact
                ),
                1
            ),
        },
        {
            "factor": "Temperature",
            "impact": round(
                min(
                    100,
                    temperature_impact
                ),
                1
            ),
        },
        {
            "factor": "Humidity",
            "impact": round(
                min(
                    100,
                    humidity_impact
                ),
                1
            ),
        },
        {
            "factor": "Soil Moisture",
            "impact": round(
                min(
                    100,
                    soil_moisture
                ),
                1
            ),
        },
    ]


# ============================================================
# RISK
# ============================================================

def calculate_risk(
    profile,
    weather,
    soil,
    average_yield,
    benchmark,
):

    # --------------------------------------------------------
    # Weather
    # --------------------------------------------------------

    if not weather.get(
        "available"
    ):

        weather_risk = 40

    else:

        rainfall = safe_number(
            weather.get(
                "average_rainfall"
            )
        )


        temperature = safe_number(
            weather.get(
                "average_temperature"
            )
        )


        weather_risk = 10


        if (
            rainfall < 700
            or rainfall > 2500
        ):

            weather_risk += 25


        if temperature < 18:

            weather_risk += 15

        elif temperature > 35:

            weather_risk += 20


        weather_risk = min(
            100,
            weather_risk
        )


    # --------------------------------------------------------
    # Soil
    # --------------------------------------------------------

    soil_score = safe_number(
        soil.get(
            "soil_score"
        )
    )


    soil_risk = max(
        0,
        100 - soil_score
    )


    # --------------------------------------------------------
    # Yield
    # --------------------------------------------------------

    if (
        benchmark > 0
        and average_yield > 0
    ):

        ratio = (
            average_yield
            / benchmark
        )


        if ratio >= 1:

            yield_risk = 10

        elif ratio >= 0.8:

            yield_risk = 25

        elif ratio >= 0.6:

            yield_risk = 50

        else:

            yield_risk = 75

    else:

        yield_risk = 20


    # --------------------------------------------------------
    # Pest
    # --------------------------------------------------------

    pest_risk = 15


    # --------------------------------------------------------
    # Overall
    # --------------------------------------------------------

    overall = round(
        (
            weather_risk
            + soil_risk
            + yield_risk
            + pest_risk
        ) / 4
    )


    if overall <= 30:

        level = "LOW"

    elif overall <= 60:

        level = "MODERATE"

    else:

        level = "HIGH"


    return {
        "overall": overall,
        "level": level,
        "weather": round(
            weather_risk
        ),
        "soil": round(
            soil_risk
        ),
        "yield": round(
            yield_risk
        ),
        "pest": pest_risk,
    }


# ============================================================
# SUGGESTIONS
# ============================================================

def generate_suggestions(
    profile,
    weather,
    soil,
    risk,
):

    suggestions = []


    rainfall = safe_number(
        weather.get(
            "average_rainfall"
        )
    )


    temperature = safe_number(
        weather.get(
            "average_temperature"
        )
    )


    nitrogen = safe_number(
        soil.get(
            "nitrogen"
        )
    )


    phosphorus = safe_number(
        soil.get(
            "phosphorus"
        )
    )


    potassium = safe_number(
        soil.get(
            "potassium"
        )
    )


    ph = safe_number(
        soil.get(
            "ph"
        )
    )


    crop = (
        get_farmer_crop(
            profile
        )
        or "your current crop"
    )


    # --------------------------------------------------------
    # Irrigation
    # --------------------------------------------------------

    if not weather.get(
        "available"
    ):

        water_text = (
            "Historical rainfall data is unavailable. "
            "Monitor local rainfall and soil moisture "
            "before adjusting irrigation."
        )

    elif rainfall < 700:

        water_text = (
            "Historical rainfall is relatively low. "
            "Monitor soil moisture and maintain "
            "consistent irrigation."
        )

    elif rainfall > 2500:

        water_text = (
            "Historical rainfall is relatively high. "
            "Ensure proper drainage and avoid "
            "unnecessary irrigation."
        )

    else:

        water_text = (
            "Rainfall conditions are generally supportive. "
            "Adjust irrigation according to soil moisture "
            "and crop requirements."
        )


    suggestions.append({
        "title": "Optimize Irrigation",
        "text": water_text,
        "type": "water",
    })


    # --------------------------------------------------------
    # Soil
    # --------------------------------------------------------

    if nitrogen < 40:

        soil_text = (
            "Nitrogen levels are relatively low. "
            "Consider appropriate nitrogen management "
            "based on soil requirements."
        )

    elif phosphorus < 20:

        soil_text = (
            "Phosphorus levels are relatively low. "
            "Consider appropriate phosphorus management."
        )

    elif potassium < 30:

        soil_text = (
            "Potassium levels are relatively low. "
            "Consider appropriate potassium management."
        )

    elif ph < 5.5:

        soil_text = (
            "Soil pH is acidic. Consider suitable "
            "soil amendments to improve pH."
        )

    elif ph > 8:

        soil_text = (
            "Soil pH is alkaline. Consider appropriate "
            "soil management practices."
        )

    else:

        soil_text = (
            "Current soil nutrient and pH indicators "
            "are generally suitable. Continue monitoring "
            "soil fertility."
        )


    suggestions.append({
        "title": "Improve Soil",
        "text": soil_text,
        "type": "soil",
    })


    # --------------------------------------------------------
    # Crop
    # --------------------------------------------------------

    suggestions.append({
        "title": "Crop Selection",
        "text": (
            f"{crop} is currently recorded as your "
            "primary crop. Compare predicted yields "
            "with alternative crops before the next season."
        ),
        "type": "crop",
    })


    # --------------------------------------------------------
    # Weather
    # --------------------------------------------------------

    if not weather.get(
        "available"
    ):

        weather_text = (
            "Historical temperature data is unavailable. "
            "Monitor local temperature conditions during "
            "the crop growth period."
        )

    elif temperature > 35:

        weather_text = (
            "Temperature conditions are relatively high. "
            "Monitor crop heat stress and irrigation needs."
        )

    elif temperature < 18:

        weather_text = (
            "Temperature conditions are relatively low. "
            "Monitor crop growth and temperature-sensitive "
            "development stages."
        )

    else:

        weather_text = (
            "Historical temperature conditions are generally "
            "supportive. Continue monitoring temperature "
            "and rainfall changes."
        )


    suggestions.append({
        "title": "Weather Monitoring",
        "text": weather_text,
        "type": "weather",
    })


    return suggestions


# ============================================================
# EMPTY DASHBOARD
# ============================================================

def get_empty_dashboard(period):

    return {
        "period": period,

        "stats": {
            "productivity_score": 0,
            "average_yield": 0,
            "best_crop": "N/A",
            "best_crop_yield": 0,
            "overall_risk": 0,
            "risk_level": "UNKNOWN",
            "prediction_count": 0,
        },

        "yield_trend": [],

        "seasonal_data": [],

        "crop_data": [],

        "weather_data": [],

        "weather_analysis": {
            "available": False,
            "average_temperature": 0,
            "average_rainfall": 0,
            "average_humidity": 0,
            "rainfall_status": "Unavailable",
            "temperature_status": "Unavailable",
        },

        "soil_analysis": {
            "available": False,
            "source": "unavailable",
            "nitrogen": 0,
            "phosphorus": 0,
            "potassium": 0,
            "ph": 0,
            "soil_score": 0,
            "quality": "Unknown",
        },

        "historical_benchmark": 0,

        "risk": {
            "overall": 0,
            "level": "UNKNOWN",
            "weather": 0,
            "soil": 0,
            "yield": 0,
            "pest": 0,
        },

        "suggestions": [],

        "reports": [
            {
                "type": "Productivity Report",
                "description": (
                    "Historical and predicted yield "
                    "trends and productivity analysis."
                ),
            },
            {
                "type": "Seasonal Report",
                "description": (
                    "Historical season-wise crop "
                    "performance analysis."
                ),
            },
            {
                "type": "Farm Health Report",
                "description": (
                    "Soil, weather and agricultural "
                    "risk assessment."
                ),
            },
        ],
    }


# ============================================================
# MAIN ANALYTICS DASHBOARD
# ============================================================

def get_analytics_dashboard(
    current_user,
    period="6 Months",
):

    # ========================================================
    # AUTHENTICATION
    # ========================================================

    user_dict = as_dict(
        current_user
    )


    if not user_dict:

        raise ValueError(
            "Authenticated user is required for analytics."
        )


    identity = resolve_authenticated_user(
        user_dict
    )


    if not identity:

        raise ValueError(
            "Authenticated user identity could not be resolved."
        )


    if not identity["ids"]:

        print(
            "[Analytics] WARNING: No Mongo user IDs "
            "were resolved from authenticated user."
        )


    # ========================================================
    # DATE RANGE
    # ========================================================

    start_date, end_date = (
        get_date_range(
            period
        )
    )


    print(
        "[Analytics] Date range:",
        start_date,
        "to",
        end_date
    )


    # ========================================================
    # FARMER PROFILE
    # ========================================================

    profile = get_farmer_profile(
        user_dict
    )


    if not profile:

        print(
            "[Analytics] No farmer profile found."
        )

        # IMPORTANT:
        # Even without a profile, predictions should
        # still be available to the dashboard.
        user_prediction_documents = (
            get_prediction_documents(
                user_dict,
                start_date,
                end_date,
            )
        )


        if user_prediction_documents:

            prediction_values = [
                get_prediction_yield(
                    document
                )
                for document
                in user_prediction_documents
            ]


            prediction_values = [
                value
                for value in prediction_values
                if value > 0
            ]


            average_yield = (
                round(
                    mean(
                        prediction_values
                    ),
                    2
                )
                if prediction_values
                else 0
            )


            crop_data = (
                get_predicted_crop_performance(
                    user_dict,
                    start_date,
                    end_date,
                )
            )


            best_crop = (
                crop_data[0]
                if crop_data
                else {
                    "crop": "N/A",
                    "yield": 0,
                }
            )


            yield_trend = (
                get_prediction_history(
                    user_dict,
                    start_date,
                    end_date,
                )
            )


            return {
                "period": period,

                "stats": {
                    "productivity_score": round(
                        min(
                            100,
                            (
                                average_yield
                                / 4
                            ) * 100
                        )
                    )
                    if average_yield > 0
                    else 0,

                    "average_yield": average_yield,

                    "best_crop": best_crop[
                        "crop"
                    ],

                    "best_crop_yield": round(
                        safe_number(
                            best_crop[
                                "yield"
                            ]
                        ),
                        2
                    ),

                    "overall_risk": 0,

                    "risk_level": "UNKNOWN",

                    "prediction_count": len(
                        user_prediction_documents
                    ),
                },

                "yield_trend": yield_trend,

                "seasonal_data": [],

                "crop_data": crop_data[:10],

                "weather_data": [],

                "weather_analysis": {
                    "available": False,
                    "average_temperature": 0,
                    "average_rainfall": 0,
                    "average_humidity": 0,
                    "rainfall_status": "Unavailable",
                    "temperature_status": "Unavailable",
                },

                "soil_analysis": {
                    "available": False,
                    "source": "unavailable",
                    "nitrogen": 0,
                    "phosphorus": 0,
                    "potassium": 0,
                    "ph": 0,
                    "soil_score": 0,
                    "quality": "Unknown",
                },

                "historical_benchmark": 0,

                "risk": {
                    "overall": 0,
                    "level": "UNKNOWN",
                    "weather": 0,
                    "soil": 0,
                    "yield": 0,
                    "pest": 0,
                },

                "suggestions": [],

                "reports": [
                    {
                        "type": "Productivity Report",
                        "description": (
                            "Historical and predicted yield "
                            "trends and productivity analysis."
                        ),
                    },
                    {
                        "type": "Seasonal Report",
                        "description": (
                            "Historical season-wise crop "
                            "performance analysis."
                        ),
                    },
                    {
                        "type": "Farm Health Report",
                        "description": (
                            "Soil, weather and agricultural "
                            "risk assessment."
                        ),
                    },
                ],
            }


        return get_empty_dashboard(
            period
        )


    # ========================================================
    # FARMER INFORMATION
    # ========================================================

    primary_crop = get_farmer_crop(
        profile
    )


    farmer_state = get_farmer_state(
        profile
    )


    print(
        "[Analytics] Farmer state:",
        farmer_state
    )


    print(
        "[Analytics] Farmer primary crop:",
        primary_crop
    )


    # ========================================================
    # WEATHER
    # ========================================================

    weather = get_weather_analysis(
        profile
    )


    # ========================================================
    # SOIL
    # ========================================================

    soil = get_soil_analysis(
        profile
    )


    # ========================================================
    # HISTORICAL DATA
    # ========================================================

    seasonal_data = (
        get_seasonal_performance(
            profile
        )
    )


    benchmark = get_yield_benchmark(
        profile
    )


    # ========================================================
    # ALL USER PREDICTIONS
    # ========================================================

    user_prediction_documents = (
        get_prediction_documents(
            user_dict,
            start_date,
            end_date,
        )
    )


    print(
        "[Analytics] FINAL USER PREDICTION COUNT:",
        len(
            user_prediction_documents
        )
    )


    # ========================================================
    # AVERAGE YIELD
    #
    # IMPORTANT:
    #
    # DO NOT filter by primary crop here.
    #
    # If the farmer's profile says Rice but the farmer just
    # predicted Wheat, that Wheat prediction MUST appear
    # in analytics.
    # ========================================================

    prediction_yields = []


    for document in user_prediction_documents:

        value = get_prediction_yield(
            document
        )


        if value > 0:

            prediction_yields.append(
                value
            )


    if prediction_yields:

        average_yield = round(
            mean(
                prediction_yields
            ),
            2
        )

    else:

        average_yield = round(
            benchmark,
            2
        )


    # ========================================================
    # CROP PERFORMANCE
    # ========================================================

    crop_data = (
        get_predicted_crop_performance(
            user_dict,
            start_date,
            end_date,
        )
    )


    # --------------------------------------------------------
    # Fallback to historical primary crop
    # --------------------------------------------------------

    if (
        not crop_data
        and primary_crop
    ):

        crop_data = [
            {
                "crop": primary_crop,
                "yield": round(
                    benchmark,
                    2
                ),
            }
        ]


    # ========================================================
    # YIELD TREND
    # ========================================================

    yield_trend = (
        get_yield_trend(
            user_dict,
            profile,
            start_date,
            end_date,
        )
    )


    # ========================================================
    # BEST CROP
    # ========================================================

    if crop_data:

        best_crop = max(
            crop_data,
            key=lambda item:
                safe_number(
                    item.get(
                        "yield"
                    )
                )
        )

    elif primary_crop:

        best_crop = {
            "crop": primary_crop,
            "yield": round(
                average_yield,
                2
            ),
        }

    else:

        best_crop = {
            "crop": "N/A",
            "yield": 0,
        }


    # ========================================================
    # PRODUCTIVITY SCORE
    # ========================================================

    if (
        benchmark > 0
        and average_yield > 0
    ):

        productivity_score = round(
            min(
                100,
                (
                    average_yield
                    / benchmark
                ) * 100
            )
        )

    elif average_yield > 0:

        productivity_score = round(
            min(
                100,
                (
                    average_yield
                    / 4
                ) * 100
            )
        )

    else:

        productivity_score = 0


    # ========================================================
    # WEATHER IMPACT
    # ========================================================

    weather_data = (
        get_weather_impact(
            weather,
            soil,
        )
    )


    # ========================================================
    # RISK
    # ========================================================

    risk = calculate_risk(
        profile,
        weather,
        soil,
        average_yield,
        benchmark,
    )


    # ========================================================
    # SUGGESTIONS
    # ========================================================

    suggestions = (
        generate_suggestions(
            profile,
            weather,
            soil,
            risk,
        )
    )


    # ========================================================
    # PREDICTION COUNT
    # ========================================================

    prediction_count = len(
        user_prediction_documents
    )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "period": period,

        "stats": {

            "productivity_score":
                productivity_score,

            "average_yield":
                average_yield,

            "best_crop":
                best_crop["crop"],

            "best_crop_yield":
                round(
                    safe_number(
                        best_crop[
                            "yield"
                        ]
                    ),
                    2
                ),

            "overall_risk":
                risk["overall"],

            "risk_level":
                risk["level"],

            "prediction_count":
                prediction_count,
        },


        "yield_trend":
            yield_trend,


        "seasonal_data":
            seasonal_data,


        "crop_data":
            crop_data[:10],


        "weather_data":
            weather_data,


        "weather_analysis":
            weather,


        "soil_analysis":
            soil,


        "historical_benchmark":
            benchmark,


        "risk":
            risk,


        "suggestions":
            suggestions,


        "reports": [

            {
                "type":
                    "Productivity Report",

                "description":
                    (
                        "Historical and predicted "
                        "yield trends and productivity "
                        "analysis."
                    ),
            },

            {
                "type":
                    "Seasonal Report",

                "description":
                    (
                        "Historical season-wise crop "
                        "performance analysis."
                    ),
            },

            {
                "type":
                    "Farm Health Report",

                "description":
                    (
                        "Soil, weather and agricultural "
                        "risk assessment."
                    ),
            },

        ],
    }