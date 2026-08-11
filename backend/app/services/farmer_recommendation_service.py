from app.services.crop_recommendation_service import recommend_crop
from app.services.weather_service import analyze_weather
from app.services.farmer_service import get_farmer_profile


def get_farmer_crop_recommendations(user_id):

    # ==========================================
    # GET FARMER PROFILE
    # ==========================================

    farmer = get_farmer_profile(user_id)

    if farmer is None:
        return {
            "error": "Farmer profile not found."
        }


    # ==========================================
    # GET PROFILE SECTIONS
    # ==========================================

    soil = farmer.get("soil", {})
    farm = farmer.get("farm", {})
    water = farmer.get("water", {})


    N = soil.get("nitrogen")
    P = soil.get("phosphorus")
    K = soil.get("potassium")
    ph = soil.get("soil_ph")

    state = farm.get("state")

    profile_rainfall = water.get("annual_rainfall")


    # ==========================================
    # REQUIRED SOIL DATA
    # ==========================================

    if (
        N is None
        or P is None
        or K is None
        or ph is None
    ):

        return {
            "error": "Incomplete farmer profile.",
            "message": (
                "Please complete N, P, K and pH "
                "information in your farmer profile."
            )
        }


    # ==========================================
    # STATE REQUIRED FOR WEATHER
    # ==========================================

    if not state:

        return {
            "error": "Incomplete farmer profile.",
            "message": "Please provide your state."
        }


    # ==========================================
    # GET WEATHER
    # ==========================================

    weather = analyze_weather(state)

    temperature = weather.get(
        "average_temperature"
    )

    humidity = weather.get(
        "average_humidity"
    )

    weather_rainfall = weather.get(
        "average_rainfall"
    )


    # ==========================================
    # RAINFALL
    # ==========================================

    rainfall = (
        profile_rainfall
        if profile_rainfall is not None
        else weather_rainfall
    )


    # ==========================================
    # CHECK WEATHER
    # ==========================================

    if (
        temperature is None
        or humidity is None
        or rainfall is None
    ):

        return {
            "error": "Weather data not available.",
            "message": (
                "Weather information for this state "
                "is not available."
            )
        }


    # ==========================================
    # MODEL INPUT
    # ==========================================

    recommendation_data = {

        "N": float(N),

        "P": float(P),

        "K": float(K),

        "temperature": float(temperature),

        "humidity": float(humidity),

        "ph": float(ph),

        "rainfall": float(rainfall),

    }


    print(
        "Crop recommendation input:",
        recommendation_data
    )


    # ==========================================
    # PREDICT
    # ==========================================

    recommendations = recommend_crop(
        recommendation_data
    )


    return {
        "recommendations": recommendations
    }