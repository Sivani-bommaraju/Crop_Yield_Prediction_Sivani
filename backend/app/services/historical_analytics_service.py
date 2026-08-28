from datetime import datetime, timedelta, timezone
from statistics import mean
from pathlib import Path

import pandas as pd

from app.database.database import db


# ============================================================
# DATABASE
# ============================================================

predictions = db["predictions"]
farmer_profiles = db["farmer_profiles"]


# ============================================================
# DATASET PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

CROP_DATA_FILE = DATA_DIR / "crop_yield_data.csv"
WEATHER_DATA_FILE = DATA_DIR / "state_weather_data.csv"
SOIL_DATA_FILE = DATA_DIR / "state_soil_data.csv"


# ============================================================
# HELPERS
# ============================================================

def safe_number(value, default=0.0):

    try:

        if value is None:
            return default

        number = float(value)

        if pd.isna(number):
            return default

        return number

    except (ValueError, TypeError):

        return default


def clean_text(value):

    if value is None:
        return ""

    return str(value).strip()


def normalize_text(value):

    return clean_text(value).lower()


def load_csv(path):

    try:

        if not path.exists():

            print(
                f"Analytics dataset not found: {path}"
            )

            return pd.DataFrame()

        df = pd.read_csv(path)

        df.columns = [
            str(column).strip()
            for column in df.columns
        ]

        return df

    except Exception as error:

        print(
            f"Unable to load analytics dataset "
            f"{path}: {error}"
        )

        return pd.DataFrame()


def normalize_datetime(value):

    """
    Convert Mongo/Python/string datetime values
    into a naive UTC datetime so comparisons
    with get_date_range() are reliable.
    """

    if value is None:
        return None

    if isinstance(value, str):

        try:

            value = datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )

        except ValueError:

            return None

    if not isinstance(value, datetime):

        return None

    # Convert timezone-aware datetime to UTC,
    # then remove timezone information.
    if value.tzinfo is not None:

        value = value.astimezone(
            timezone.utc
        ).replace(
            tzinfo=None
        )

    return value


def get_prediction_yield(document):

    """
    Supports all prediction field names used
    in previous versions of the application.
    """

    possible_fields = [
        "predicted_yield",
        "yield_prediction",
        "predictedYield",
        "yield"
    ]

    for field in possible_fields:

        value = document.get(field)

        if value is not None:

            numeric_value = safe_number(
                value
            )

            if numeric_value > 0:

                return numeric_value

    return 0.0


def get_prediction_crop(document):

    """
    Supports the current prediction structure
    and older field names.
    """

    possible_fields = [
        "crop",
        "Crop"
    ]

    for field in possible_fields:

        value = clean_text(
            document.get(field)
        )

        if value:

            return value

    inputs = document.get(
        "inputs",
        {}
    )

    if isinstance(inputs, dict):

        for field in [
            "Crop",
            "crop"
        ]:

            value = clean_text(
                inputs.get(field)
            )

            if value:

                return value

    return ""


def get_prediction_state(document):

    possible_fields = [
        "state",
        "State"
    ]

    for field in possible_fields:

        value = clean_text(
            document.get(field)
        )

        if value:

            return value

    inputs = document.get(
        "inputs",
        {}
    )

    if isinstance(inputs, dict):

        for field in [
            "State",
            "state"
        ]:

            value = clean_text(
                inputs.get(field)
            )

            if value:

                return value

    return ""


def get_prediction_season(document):

    possible_fields = [
        "season",
        "Season"
    ]

    for field in possible_fields:

        value = clean_text(
            document.get(field)
        )

        if value:

            return value

    inputs = document.get(
        "inputs",
        {}
    )

    if isinstance(inputs, dict):

        for field in [
            "Season",
            "season"
        ]:

            value = clean_text(
                inputs.get(field)
            )

            if value:

                return value

    return ""


def get_date_range(period):

    """
    Return a naive UTC datetime range.

    MongoDB prediction documents are generally stored
    as UTC datetimes, so this keeps the comparison
    consistent.
    """

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
# FARMER PROFILE
# ============================================================

def get_farmer_profile():

    profile = farmer_profiles.find_one({})

    if not profile:

        return {}

    return profile


def get_farmer_state(profile):

    state = clean_text(
        profile.get("state")
    )

    if state:

        return state

    location = profile.get(
        "location",
        {}
    )

    if isinstance(location, dict):

        return clean_text(
            location.get("state")
        )

    return ""


def get_farmer_crop(profile):

    crop = profile.get(
        "crop",
        {}
    )

    if isinstance(crop, dict):

        return clean_text(
            crop.get(
                "primary_crop"
            )
        )

    return clean_text(crop)


def get_latest_prediction():

    return predictions.find_one(
        {
            "$or": [
                {
                    "predicted_yield": {
                        "$exists": True
                    }
                },
                {
                    "yield_prediction": {
                        "$exists": True
                    }
                },
                {
                    "predictedYield": {
                        "$exists": True
                    }
                }
            ]
        },
        sort=[
            (
                "created_at",
                -1
            )
        ]
    )


def get_current_crop(profile):

    """
    The latest prediction is the most reliable indication
    of the crop currently being analyzed.

    If no prediction exists, fall back to farmer profile.
    """

    latest = get_latest_prediction()

    if latest:

        prediction_crop = (
            get_prediction_crop(
                latest
            )
        )

        if prediction_crop:

            return prediction_crop

    return get_farmer_crop(
        profile
    )


def get_current_state(profile):

    latest = get_latest_prediction()

    if latest:

        prediction_state = (
            get_prediction_state(
                latest
            )
        )

        if prediction_state:

            return prediction_state

    return get_farmer_state(
        profile
    )


# ============================================================
# HISTORICAL CROP DATA
# ============================================================

def get_historical_crop_data(
    profile,
    crop_override=None,
    state_override=None
):

    df = load_csv(
        CROP_DATA_FILE
    )

    if df.empty:

        return df

    state = (
        clean_text(state_override)
        if state_override
        else get_current_state(profile)
    )

    crop = (
        clean_text(crop_override)
        if crop_override
        else get_current_crop(profile)
    )

    # --------------------------------------------------------
    # STATE FILTER
    # --------------------------------------------------------

    if state and "State" in df.columns:

        state_mask = (
            df["State"]
            .astype(str)
            .str.strip()
            .str.lower()
            == normalize_text(state)
        )

        state_data = df[
            state_mask
        ]

        if not state_data.empty:

            df = state_data

    # --------------------------------------------------------
    # CROP FILTER
    # --------------------------------------------------------

    if crop and "Crop" in df.columns:

        crop_mask = (
            df["Crop"]
            .astype(str)
            .str.strip()
            .str.lower()
            == normalize_text(crop)
        )

        crop_data = df[
            crop_mask
        ]

        if not crop_data.empty:

            df = crop_data

    return df


# ============================================================
# HISTORICAL CROP PERFORMANCE
# ============================================================

def get_historical_crop_performance(
    profile
):

    """
    Return historical performance of crops in the
    farmer's state.

    We intentionally DO NOT restrict this to the
    current crop here because this function is used
    to compare alternative crops.
    """

    df = load_csv(
        CROP_DATA_FILE
    )

    if df.empty:

        return []

    if "Crop" not in df.columns:

        return []

    if "Yield" not in df.columns:

        return []

    state = get_current_state(
        profile
    )

    # --------------------------------------------------------
    # STATE FILTER
    # --------------------------------------------------------

    if state and "State" in df.columns:

        state_mask = (
            df["State"]
            .astype(str)
            .str.strip()
            .str.lower()
            == normalize_text(state)
        )

        state_data = df[
            state_mask
        ]

        if not state_data.empty:

            df = state_data

    # --------------------------------------------------------
    # YIELD
    # --------------------------------------------------------

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

    grouped = (
        df.groupby("Crop")["Yield"]
        .mean()
        .sort_values(
            ascending=False
        )
        .head(10)
    )

    results = []

    for crop, value in grouped.items():

        results.append(
            {
                "crop":
                    clean_text(crop),

                "yield":
                    round(
                        safe_number(value),
                        2
                    )
            }
        )

    return results


# ============================================================
# CURRENT CROP HISTORICAL BENCHMARK
# ============================================================

def get_current_crop_historical_benchmark(
    profile
):

    current_crop = get_current_crop(
        profile
    )

    state = get_current_state(
        profile
    )

    if not current_crop:

        return 0

    df = get_historical_crop_data(
        profile,
        crop_override=current_crop,
        state_override=state
    )

    if df.empty:

        return 0

    if "Yield" not in df.columns:

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
# SEASONAL PERFORMANCE
# ============================================================

def get_historical_seasonal_performance(
    profile
):

    current_crop = get_current_crop(
        profile
    )

    df = get_historical_crop_data(
        profile,
        crop_override=current_crop
    )

    if df.empty:

        return []

    if "Season" not in df.columns:

        return []

    if "Yield" not in df.columns:

        return []

    df = df.copy()

    df["Yield"] = pd.to_numeric(
        df["Yield"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Yield"]
    )

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

    results = []

    for season, value in grouped.items():

        results.append(
            {
                "season":
                    clean_text(season),

                "yield":
                    round(
                        safe_number(value),
                        2
                    )
            }
        )

    return results


def get_seasonal_prediction_data():

    documents = list(
        predictions.find(
            {
                "season": {
                    "$exists": True,
                    "$ne": None
                }
            }
        )
    )

    seasonal = {}

    for document in documents:

        season = get_prediction_season(
            document
        )

        value = get_prediction_yield(
            document
        )

        if not season or value <= 0:

            continue

        seasonal.setdefault(
            season,
            []
        )

        seasonal[season].append(
            value
        )

    results = []

    for season, values in seasonal.items():

        results.append(
            {
                "season":
                    season,

                "yield":
                    round(
                        mean(values),
                        2
                    ),

                "predicted":
                    round(
                        mean(values),
                        2
                    )
            }
        )

    return results


# ============================================================
# SEASONAL PERFORMANCE COMBINED
# ============================================================

def get_seasonal_performance(
    profile
):

    historical = (
        get_historical_seasonal_performance(
            profile
        )
    )

    predicted = (
        get_seasonal_prediction_data()
    )

    merged = {}

    for item in historical:

        merged[
            item["season"]
        ] = {
            "season":
                item["season"],

            "yield":
                item["yield"]
        }

    for item in predicted:

        season = item["season"]

        if season not in merged:

            merged[season] = {
                "season":
                    season,

                "yield":
                    item["yield"]
            }

        merged[season][
            "predicted"
        ] = item["predicted"]

    results = list(
        merged.values()
    )

    results.sort(
        key=lambda x: x["yield"],
        reverse=True
    )

    return results


# ============================================================
# HISTORICAL YIELD TREND
# ============================================================

def get_historical_yield_trend(
    profile
):

    current_crop = get_current_crop(
        profile
    )

    df = get_historical_crop_data(
        profile,
        crop_override=current_crop
    )

    if df.empty:

        return []

    if "Crop_Year" not in df.columns:

        return []

    if "Yield" not in df.columns:

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
            "Yield"
        ]
    )

    grouped = (
        df.groupby("Crop_Year")["Yield"]
        .mean()
        .sort_index()
    )

    results = []

    for year, value in grouped.items():

        results.append(
            {
                "year":
                    str(int(year)),

                "yield":
                    round(
                        safe_number(value),
                        2
                    ),

                "actual":
                    round(
                        safe_number(value),
                        2
                    )
            }
        )

    return results


# ============================================================
# MONGO PREDICTION HISTORY
# ============================================================

def get_prediction_history(
    profile,
    start_date=None,
    end_date=None
):

    query = {
        "$or": [
            {
                "predicted_yield": {
                    "$exists": True
                }
            },
            {
                "yield_prediction": {
                    "$exists": True
                }
            },
            {
                "predictedYield": {
                    "$exists": True
                }
            }
        ]
    }

    # --------------------------------------------------------
    # DATE FILTER
    # --------------------------------------------------------

    if start_date is not None and end_date is not None:

        query["created_at"] = {
            "$gte": start_date,
            "$lte": end_date
        }

    documents = list(
        predictions.find(query).sort(
            "created_at",
            1
        )
    )

    current_crop = get_current_crop(
        profile
    )

    results = []

    for document in documents:

        crop = get_prediction_crop(
            document
        )

        # If a current crop exists, keep prediction
        # history focused on that crop.
        if (
            current_crop
            and crop
            and normalize_text(crop)
            != normalize_text(current_crop)
        ):

            continue

        value = get_prediction_yield(
            document
        )

        if value <= 0:

            continue

        created_at = normalize_datetime(
            document.get(
                "created_at"
            )
        )

        if created_at is None:

            # If there is no valid date, still retain
            # the prediction using the crop year when
            # available.
            inputs = document.get(
                "inputs",
                {}
            )

            crop_year = None

            if isinstance(inputs, dict):

                crop_year = inputs.get(
                    "Crop_Year"
                )

            if crop_year:

                results.append(
                    {
                        "year":
                            str(
                                int(
                                    safe_number(
                                        crop_year
                                    )
                                )
                            ),

                        "yield":
                            round(
                                value,
                                2
                            )
                    }
                )

            continue

        results.append(
            {
                "year":
                    str(
                        created_at.year
                    ),

                "yield":
                    round(
                        value,
                        2
                    )
            }
        )

    return results


# ============================================================
# COMBINED YIELD TREND
# ============================================================

def get_yield_trend(
    profile,
    start_date,
    end_date
):

    historical = (
        get_historical_yield_trend(
            profile
        )
    )

    predictions_history = (
        get_prediction_history(
            profile,
            start_date,
            end_date
        )
    )

    combined = {}

    # --------------------------------------------------------
    # Historical actual
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
    # AI prediction
    # --------------------------------------------------------

    for item in predictions_history:

        year = item["year"]

        combined.setdefault(
            year,
            {}
        )

        # If multiple predictions exist for the same
        # year, average them.
        existing_predictions = (
            combined[year]
            .get(
                "_predictions",
                []
            )
        )

        existing_predictions.append(
            item["yield"]
        )

        combined[year][
            "_predictions"
        ] = existing_predictions

    results = []

    for year in sorted(
        combined.keys()
    ):

        item = combined[year]

        result = {
            "year":
                year
        }

        # Historical actual
        if "actual" in item:

            result["actual"] = round(
                safe_number(
                    item["actual"]
                ),
                2
            )

        # Predicted average
        if item.get(
            "_predictions"
        ):

            predicted_average = mean(
                item["_predictions"]
            )

            result["predicted"] = round(
                predicted_average,
                2
            )

        # Frontend-friendly yield
        if "predicted" in result:

            # For years that contain predictions,
            # show prediction as the main value only
            # when there isn't an actual historical value.
            if "actual" not in result:

                result["yield"] = result[
                    "predicted"
                ]

            else:

                result["yield"] = result[
                    "actual"
                ]

        elif "actual" in result:

            result["yield"] = result[
                "actual"
            ]

        results.append(
            result
        )

    return results


# ============================================================
# CROP PERFORMANCE
# ============================================================

def get_crop_performance(
    profile
):

    historical = (
        get_historical_crop_performance(
            profile
        )
    )

    current_crop = get_current_crop(
        profile
    )

    # --------------------------------------------------------
    # Prediction averages
    # --------------------------------------------------------

    documents = list(
        predictions.find({})
    )

    prediction_crops = {}

    for document in documents:

        crop = get_prediction_crop(
            document
        )

        value = get_prediction_yield(
            document
        )

        if not crop or value <= 0:

            continue

        prediction_crops.setdefault(
            crop,
            []
        )

        prediction_crops[
            crop
        ].append(value)

    # --------------------------------------------------------
    # Historical map
    # --------------------------------------------------------

    historical_map = {}

    for item in historical:

        historical_map[
            normalize_text(
                item["crop"]
            )
        ] = {
            "crop":
                item["crop"],

            "yield":
                item["yield"]
        }

    # --------------------------------------------------------
    # Build result
    # --------------------------------------------------------

    merged = {}

    for key, item in historical_map.items():

        merged[key] = {
            "crop":
                item["crop"],

            "historical_yield":
                item["yield"]
        }

    for crop, values in prediction_crops.items():

        key = normalize_text(crop)

        predicted_average = round(
            mean(values),
            2
        )

        if key not in merged:

            merged[key] = {
                "crop":
                    crop,

                "predicted_yield":
                    predicted_average
            }

        else:

            merged[key][
                "predicted_yield"
            ] = predicted_average

    results = []

    for item in merged.values():

        historical_yield = safe_number(
            item.get(
                "historical_yield"
            )
        )

        predicted_yield = safe_number(
            item.get(
                "predicted_yield"
            )
        )

        # Main displayed yield:
        # use predicted yield for current crop,
        # otherwise historical benchmark.
        if (
            current_crop
            and normalize_text(
                item["crop"]
            )
            == normalize_text(
                current_crop
            )
            and predicted_yield > 0
        ):

            display_yield = predicted_yield

        elif historical_yield > 0:

            display_yield = historical_yield

        else:

            display_yield = predicted_yield

        result = {
            "crop":
                item["crop"],

            "yield":
                round(
                    display_yield,
                    2
                )
        }

        if historical_yield > 0:

            result[
                "historical_yield"
            ] = round(
                historical_yield,
                2
            )

        if predicted_yield > 0:

            result[
                "predicted_yield"
            ] = round(
                predicted_yield,
                2
            )

        results.append(
            result
        )

    # --------------------------------------------------------
    # Put current crop first
    # --------------------------------------------------------

    results.sort(
        key=lambda x: (
            0
            if (
                current_crop
                and normalize_text(
                    x["crop"]
                )
                == normalize_text(
                    current_crop
                )
            )
            else 1,
            -safe_number(
                x["yield"]
            )
        )
    )

    return results[:10]


# ============================================================
# WEATHER ANALYSIS
# ============================================================

def get_weather_analysis(
    profile
):

    df = load_csv(
        WEATHER_DATA_FILE
    )

    unavailable = {
        "available":
            False,

        "average_temperature":
            0,

        "average_rainfall":
            0,

        "average_humidity":
            0,

        "rainfall_status":
            "Unavailable",

        "temperature_status":
            "Unavailable"
    }

    if df.empty:

        return unavailable

    state = get_current_state(
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
            == normalize_text(state)
        ]

        if not filtered.empty:

            df = filtered

        else:

            return unavailable

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

    if (
        temperature == 0
        and rainfall == 0
        and humidity == 0
    ):

        return unavailable

    # --------------------------------------------------------
    # WEATHER STATUS
    # --------------------------------------------------------

    if rainfall < 700:

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

    if 20 <= temperature <= 32:

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

        "available":
            True,

        "average_temperature":
            temperature,

        "average_rainfall":
            rainfall,

        "average_humidity":
            humidity,

        "rainfall_status":
            rainfall_status,

        "temperature_status":
            temperature_status

    }


# ============================================================
# SOIL ANALYSIS
# ============================================================

def get_soil_analysis(
    profile
):

    df = load_csv(
        SOIL_DATA_FILE
    )

    if df.empty:

        return {
            "available":
                False,

            "nitrogen":
                0,

            "phosphorus":
                0,

            "potassium":
                0,

            "ph":
                0,

            "soil_score":
                0,

            "quality":
                "Unknown"
        }

    state = get_current_state(
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
            == normalize_text(state)
        ]

        if not filtered.empty:

            df = filtered

    values = {}

    for column in [
        "N",
        "P",
        "K",
        "pH"
    ]:

        if column in df.columns:

            numeric = pd.to_numeric(
                df[column],
                errors="coerce"
            ).dropna()

            if not numeric.empty:

                values[column] = round(
                    numeric.mean(),
                    2
                )

            else:

                values[column] = 0

        else:

            values[column] = 0

    nitrogen = values["N"]
    phosphorus = values["P"]
    potassium = values["K"]
    ph = values["pH"]

    # --------------------------------------------------------
    # SOIL SCORE
    # --------------------------------------------------------

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

    return {

        "available":
            True,

        "nitrogen":
            nitrogen,

        "phosphorus":
            phosphorus,

        "potassium":
            potassium,

        "ph":
            ph,

        "soil_score":
            score,

        "quality":
            quality

    }


# ============================================================
# HISTORICAL YIELD BENCHMARK
# ============================================================

def get_yield_benchmark(
    profile
):

    return get_current_crop_historical_benchmark(
        profile
    )


# ============================================================
# WEATHER IMPACT
# ============================================================

def get_weather_impact(
    weather,
    soil
):

    if not weather.get(
        "available"
    ):

        return [
            {
                "factor":
                    "Rainfall",
                "impact":
                    0
            },
            {
                "factor":
                    "Temperature",
                "impact":
                    0
            },
            {
                "factor":
                    "Humidity",
                "impact":
                    0
            },
            {
                "factor":
                    "Soil Moisture",
                "impact":
                    0
            }
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

    rainfall_impact = max(
        0,
        100 -
        abs(
            rainfall - 1200
        ) / 12
    )

    temperature_impact = max(
        0,
        100 -
        abs(
            temperature - 27
        ) * 7
    )

    humidity_impact = max(
        0,
        100 -
        abs(
            humidity - 70
        ) * 2
    )

    soil_score = safe_number(
        soil.get(
            "soil_score"
        )
    )

    soil_moisture = (
        rainfall_impact * 0.6
        + soil_score * 0.4
    )

    return [

        {
            "factor":
                "Rainfall",

            "impact":
                round(
                    min(
                        100,
                        rainfall_impact
                    ),
                    1
                )
        },

        {
            "factor":
                "Temperature",

            "impact":
                round(
                    min(
                        100,
                        temperature_impact
                    ),
                    1
                )
        },

        {
            "factor":
                "Humidity",

            "impact":
                round(
                    min(
                        100,
                        humidity_impact
                    ),
                    1
                )
        },

        {
            "factor":
                "Soil Moisture",

            "impact":
                round(
                    min(
                        100,
                        soil_moisture
                    ),
                    1
                )
        }

    ]


# ============================================================
# RISK ASSESSMENT
# ============================================================

def calculate_risk(
    profile,
    weather,
    soil,
    average_yield,
    benchmark
):

    # --------------------------------------------------------
    # WEATHER RISK
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

        if rainfall < 700:

            weather_risk += 25

        elif rainfall > 2500:

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
    # SOIL RISK
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
    # YIELD RISK
    # --------------------------------------------------------

    if benchmark > 0 and average_yield > 0:

        performance_ratio = (
            average_yield /
            benchmark
        )

        if performance_ratio >= 1:

            yield_risk = 10

        elif performance_ratio >= 0.8:

            yield_risk = 25

        elif performance_ratio >= 0.6:

            yield_risk = 50

        else:

            yield_risk = 75

    else:

        yield_risk = 20

    # --------------------------------------------------------
    # PEST RISK
    # --------------------------------------------------------

    pest_risk = 15

    # --------------------------------------------------------
    # OVERALL
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

        "overall":
            overall,

        "level":
            level,

        "weather":
            round(weather_risk),

        "soil":
            round(soil_risk),

        "yield":
            round(yield_risk),

        "pest":
            pest_risk

    }


# ============================================================
# SUGGESTIONS
# ============================================================

def generate_suggestions(
    profile,
    weather,
    soil,
    risk
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

    crop = get_current_crop(
        profile
    )

    if not crop:

        crop = "your current crop"

    # --------------------------------------------------------
    # WATER
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
            "Rainfall conditions are within a generally "
            "supportive range. Adjust irrigation according "
            "to soil moisture and crop requirements."
        )

    suggestions.append(
        {
            "title":
                "Optimize Irrigation",

            "text":
                water_text,

            "type":
                "water"
        }
    )

    # --------------------------------------------------------
    # SOIL
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
            "are generally suitable. Continue "
            "monitoring soil fertility."
        )

    suggestions.append(
        {
            "title":
                "Improve Soil",

            "text":
                soil_text,

            "type":
                "soil"
        }
    )

    # --------------------------------------------------------
    # CROP
    # --------------------------------------------------------

    suggestions.append(
        {
            "title":
                "Crop Selection",

            "text":
                (
                    f"{crop} is currently being analyzed. "
                    "Compare its historical benchmark and "
                    "predicted yield with alternative crops "
                    "before the next season."
                ),

            "type":
                "crop"
        }
    )

    # --------------------------------------------------------
    # WEATHER
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
            "Historical temperature conditions are "
            "generally supportive. Continue monitoring "
            "temperature and rainfall changes."
        )

    suggestions.append(
        {
            "title":
                "Weather Monitoring",

            "text":
                weather_text,

            "type":
                "weather"
        }
    )

    return suggestions


# ============================================================
# MAIN ANALYTICS DASHBOARD
# ============================================================

def get_analytics_dashboard(
    period="6 Months"
):

    start_date, end_date = (
        get_date_range(
            period
        )
    )

    # ========================================================
    # FARMER PROFILE
    # ========================================================

    profile = get_farmer_profile()

    current_crop = get_current_crop(
        profile
    )

    current_state = get_current_state(
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
    # YIELD TREND
    # ========================================================

    yield_trend = get_yield_trend(
        profile,
        start_date,
        end_date
    )

    # ========================================================
    # CROP PERFORMANCE
    # ========================================================

    crop_data = get_crop_performance(
        profile
    )

    # ========================================================
    # CURRENT PREDICTIONS
    #
    # Directly retrieve Mongo predictions for the current
    # crop and period. This is the important fix for the
    # previous average_yield = 0 problem.
    # ========================================================

    prediction_query = {
        "created_at": {
            "$gte": start_date,
            "$lte": end_date
        }
    }

    documents = list(
        predictions.find(
            prediction_query
        )
    )

    prediction_values = []

    for document in documents:

        crop = get_prediction_crop(
            document
        )

        # Focus analytics on the current crop.
        if (
            current_crop
            and crop
            and normalize_text(crop)
            != normalize_text(current_crop)
        ):

            continue

        value = get_prediction_yield(
            document
        )

        if value > 0:

            prediction_values.append(
                value
            )

    # ========================================================
    # AVERAGE PREDICTED YIELD
    # ========================================================

    if prediction_values:

        average_yield = round(
            mean(
                prediction_values
            ),
            2
        )

    else:

        average_yield = 0

    # ========================================================
    # HISTORICAL BENCHMARK
    #
    # IMPORTANT:
    # This is now specific to the current crop.
    # ========================================================

    benchmark = (
        get_current_crop_historical_benchmark(
            profile
        )
    )

    # ========================================================
    # CURRENT CROP DATA
    # ========================================================

    current_crop_historical_yield = (
        benchmark
    )

    current_crop_predicted_yield = (
        average_yield
    )

    # ========================================================
    # PRODUCTIVITY SCORE
    #
    # Compare predicted yield against historical
    # benchmark for the SAME crop.
    # ========================================================

    if (
        benchmark > 0
        and average_yield > 0
    ):

        productivity_score = round(
            min(
                100,
                (
                    average_yield /
                    benchmark
                ) * 100
            )
        )

    elif average_yield > 0:

        productivity_score = round(
            min(
                100,
                (
                    average_yield /
                    4
                ) * 100
            )
        )

    else:

        productivity_score = 0

    # ========================================================
    # BEST ALTERNATIVE CROP
    #
    # Do not call Coconut "best" simply because its yield
    # number is numerically larger.
    #
    # Instead, find the best historical crop while clearly
    # identifying it as an alternative.
    # ========================================================

    alternative_crops = []

    for item in crop_data:

        crop_name = clean_text(
            item.get("crop")
        )

        if not crop_name:

            continue

        if (
            current_crop
            and normalize_text(crop_name)
            == normalize_text(current_crop)
        ):

            continue

        alternative_crops.append(
            item
        )

    if alternative_crops:

        best_alternative_crop = (
            alternative_crops[0]
        )

    else:

        best_alternative_crop = {
            "crop":
                current_crop
                if current_crop
                else "N/A",

            "yield":
                current_crop_historical_yield
        }

    # ========================================================
    # WEATHER IMPACT
    # ========================================================

    weather_data = (
        get_weather_impact(
            weather,
            soil
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
        benchmark
    )

    # ========================================================
    # SUGGESTIONS
    # ========================================================

    suggestions = (
        generate_suggestions(
            profile,
            weather,
            soil,
            risk
        )
    )

    # ========================================================
    # PREDICTION COUNT
    # ========================================================

    prediction_count = (
        len(
            prediction_values
        )
    )

    # ========================================================
    # REPORTS
    # ========================================================

    reports = [

        {
            "type":
                "Productivity Report",

            "description":
                (
                    "Historical and predicted yield "
                    "trends for the current crop, "
                    "including productivity comparison "
                    "against historical performance."
                )
        },

        {
            "type":
                "Seasonal Report",

            "description":
                (
                    "Historical season-wise crop "
                    "performance analysis for the "
                    "current crop."
                )
        },

        {
            "type":
                "Farm Health Report",

            "description":
                (
                    "Soil, weather and agricultural "
                    "risk assessment based on available "
                    "farm and historical data."
                )
        }

    ]

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "period":
            period,

        "stats": {

            "productivity_score":
                productivity_score,

            "average_yield":
                average_yield,

            "current_crop":
                current_crop
                if current_crop
                else "N/A",

            "historical_crop_yield":
                current_crop_historical_yield,

            "predicted_yield":
                current_crop_predicted_yield,

            "best_crop":
                best_alternative_crop[
                    "crop"
                ],

            "best_crop_yield":
                best_alternative_crop[
                    "yield"
                ],

            "overall_risk":
                risk[
                    "overall"
                ],

            "risk_level":
                risk[
                    "level"
                ],

            "prediction_count":
                prediction_count

        },

        "yield_trend":
            yield_trend,

        "seasonal_data":
            seasonal_data,

        "crop_data":
            crop_data,

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

        "reports":
            reports

    }