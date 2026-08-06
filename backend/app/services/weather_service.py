import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

WEATHER_DATA = BASE_DIR / "ML" / "datasets" / "raw" / "state_weather_data_1997_2020.csv"

weather_df = pd.read_csv(WEATHER_DATA)


def analyze_weather(state: str):
    state_data = weather_df[weather_df["state"] == state]

    if state_data.empty:
        return {
            "average_temperature": None,
            "average_rainfall": None,
            "average_humidity": None,
            "impact": "Weather data not available."
        }

    avg_temp = float(round(state_data["avg_temp_c"].mean(), 2))
    avg_rainfall = float(round(state_data["total_rainfall_mm"].mean(), 2))
    avg_humidity = float(round(state_data["avg_humidity_percent"].mean(), 2))

    # Rainfall Analysis
    if avg_rainfall < 700:
        rainfall_status = "Low Rainfall"
    elif avg_rainfall > 1500:
        rainfall_status = "Heavy Rainfall"
    else:
        rainfall_status = "Normal Rainfall"

    # Temperature Analysis
    if avg_temp > 35:
        temperature_status = "High Temperature"
    elif avg_temp < 18:
        temperature_status = "Low Temperature"
    else:
        temperature_status = "Optimal Temperature"

    # Weather Impact Assessment
    if rainfall_status == "Low Rainfall":
        impact = (
            "Low rainfall may reduce crop yield. "
            "Additional irrigation is recommended."
        )
    elif rainfall_status == "Heavy Rainfall":
        impact = (
            "Heavy rainfall may increase waterlogging and disease risk."
        )
    else:
        impact = (
            "Weather conditions are generally favorable for crop growth."
        )

    return {
        "average_temperature": avg_temp,
        "average_rainfall": avg_rainfall,
        "average_humidity": avg_humidity,
        "rainfall_status": rainfall_status,
        "temperature_status": temperature_status,
        "impact": impact,
    }