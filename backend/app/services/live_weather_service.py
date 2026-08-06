import os
import requests
from dotenv import load_dotenv

load_dotenv()
from app.config.config import settings

API_KEY = settings.OPENWEATHER_API_KEY

def get_live_weather(village, state):

    location = f"{village},{state},IN"

    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?q={location}"
        f"&appid={API_KEY}"
        "&units=metric"
    )

    response = requests.get(url)

    if response.status_code != 200:
        return None

    data = response.json()

    rain = 0

    if "rain" in data:
        rain = data["rain"].get("1h", 0)

    return {
        "location": data["name"],
        "temperature": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "humidity": data["main"]["humidity"],
        "wind_speed": round(data["wind"]["speed"] * 3.6),
        "description": data["weather"][0]["description"].title(),
        "rain": rain
    }