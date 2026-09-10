import {
  CloudSun,
  Wind,
  Droplets,
  ThermometerSun,
  CloudRain,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherCard({ profile }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(false);

        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        if (!apiKey) {
          console.error("OpenWeather API key is missing");
          setError(true);
          return;
        }

        /*
          Use the farmer's registered farm location.

          Priority:
          Village + District + State
          ↓
          District + State
          ↓
          State
        */

        const locations = [
          [
            profile?.farm?.village,
            profile?.farm?.district,
            profile?.farm?.state,
            "India",
          ]
            .filter(Boolean)
            .join(", "),

          [
            profile?.farm?.district,
            profile?.farm?.state,
            "India",
          ]
            .filter(Boolean)
            .join(", "),

          [
            profile?.farm?.state,
            "India",
          ]
            .filter(Boolean)
            .join(", "),
        ].filter(Boolean);

        let coordinates = null;
        let resolvedLocation = "";

        // --------------------------------
        // STEP 1: OpenWeather Geocoding
        // --------------------------------

        for (const location of locations) {
          try {
            console.log("Trying location:", location);

            const geoUrl =
              `https://api.openweathermap.org/geo/1.0/direct` +
              `?q=${encodeURIComponent(location)}` +
              `&limit=1` +
              `&appid=${apiKey}`;

            const geoResponse = await fetch(geoUrl);

            if (!geoResponse.ok) {
              continue;
            }

            const geoData = await geoResponse.json();

            if (geoData.length > 0) {
              coordinates = {
                lat: geoData[0].lat,
                lon: geoData[0].lon,
              };

              resolvedLocation = geoData[0].name;

              console.log(
                "Location resolved:",
                geoData[0]
              );

              break;
            }
          } catch (geoError) {
            console.log(
              "Geocoding failed for:",
              location
            );
          }
        }

        if (!coordinates) {
          throw new Error(
            "Unable to find farmer's location"
          );
        }

        // --------------------------------
        // STEP 2: Current Weather
        // --------------------------------

        const weatherUrl =
          `https://api.openweathermap.org/data/2.5/weather` +
          `?lat=${coordinates.lat}` +
          `&lon=${coordinates.lon}` +
          `&units=metric` +
          `&appid=${apiKey}`;

        const weatherResponse = await fetch(
          weatherUrl
        );

        if (!weatherResponse.ok) {
          throw new Error(
            "Unable to fetch current weather"
          );
        }

        const weatherData =
          await weatherResponse.json();

        setWeather({
          ...weatherData,
          resolvedLocation,
        });

      } catch (err) {
        console.error(
          "Weather API error:",
          err
        );

        setError(true);

      } finally {
        setLoading(false);
      }
    }

    if (profile) {
      fetchWeather();
    }

  }, [profile]);

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl text-white shadow-lg p-8 h-full">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              Today's Weather
            </h2>

            <p className="opacity-80">
              Loading weather...
            </p>
          </div>

          <CloudSun size={55} />

        </div>

        <div className="mt-8">

          <h1 className="text-4xl font-bold">
            Loading...
          </h1>

        </div>

      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl text-white shadow-lg p-8 h-full">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">
              Today's Weather
            </h2>

            <p className="opacity-80">
              Weather unavailable
            </p>

          </div>

          <CloudSun size={55} />

        </div>

        <div className="mt-8">

          <p className="opacity-80">
            Unable to load current weather.
          </p>

        </div>

      </div>
    );
  }

  // -----------------------------
  // Weather values
  // -----------------------------

  const temperature =
    Math.round(weather.main.temp);

  const feelsLike =
    Math.round(weather.main.feels_like);

  const humidity =
    weather.main.humidity;

  // OpenWeather returns wind speed in m/s
  // Convert to km/h

  const windSpeed =
    Math.round(weather.wind.speed * 3.6);

  // Rain in last hour, if available

  const rain =
    weather.rain?.["1h"] ?? 0;

  const description =
    weather.weather?.[0]?.description ||
    "Clear";

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl text-white shadow-lg p-8 h-full">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            Today's Weather
          </h2>

          <p className="opacity-80 capitalize">
            {weather.resolvedLocation ||
              weather.name}
          </p>

        </div>

        <CloudSun size={55} />

      </div>

      <div className="mt-8">

        <h1 className="text-6xl font-bold">
          {temperature}°
        </h1>

        <p className="opacity-80 mt-2 capitalize">
          {description}
        </p>

      </div>

      <div className="grid grid-cols-2 gap-5 mt-10">

        <div className="bg-white/15 rounded-2xl p-4">

          <ThermometerSun size={22} />

          <p className="mt-3 text-sm">
            Feels Like
          </p>

          <h3 className="font-bold">
            {feelsLike}°C
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <Droplets size={22} />

          <p className="mt-3 text-sm">
            Humidity
          </p>

          <h3 className="font-bold">
            {humidity}%
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <Wind size={22} />

          <p className="mt-3 text-sm">
            Wind
          </p>

          <h3 className="font-bold">
            {windSpeed} km/h
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <CloudRain size={22} />

          <p className="mt-3 text-sm">
            Rain
          </p>

          <h3 className="font-bold">
            {rain} mm
          </h3>

        </div>

      </div>

    </div>
  );
}