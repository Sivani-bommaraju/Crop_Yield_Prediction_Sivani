import {
  CloudSun,
  Wind,
  Droplets,
  ThermometerSun,
  CloudRain,
} from "lucide-react";

export default function WeatherCard() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl text-white shadow-lg p-8 h-full">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            Today's Weather
          </h2>

          <p className="opacity-80">
            Amaravati
          </p>

        </div>

        <CloudSun size={55} />

      </div>

      <div className="mt-8">

        <h1 className="text-6xl font-bold">
          29°
        </h1>

        <p className="opacity-80 mt-2">
          Partly Cloudy
        </p>

      </div>

      <div className="grid grid-cols-2 gap-5 mt-10">

        <div className="bg-white/15 rounded-2xl p-4">

          <ThermometerSun size={22} />

          <p className="mt-3 text-sm">
            Feels Like
          </p>

          <h3 className="font-bold">
            31°C
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <Droplets size={22} />

          <p className="mt-3 text-sm">
            Humidity
          </p>

          <h3 className="font-bold">
            71%
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <Wind size={22} />

          <p className="mt-3 text-sm">
            Wind
          </p>

          <h3 className="font-bold">
            14 km/h
          </h3>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <CloudRain size={22} />

          <p className="mt-3 text-sm">
            Rain
          </p>

          <h3 className="font-bold">
            20%
          </h3>

        </div>

      </div>

    </div>
  );
}