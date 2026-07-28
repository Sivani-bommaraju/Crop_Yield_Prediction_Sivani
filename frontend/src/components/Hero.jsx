import {
  ArrowRight,
  BarChart3,
  Wheat,
  CloudSun,
  Sprout,
  MapPin,
} from "lucide-react";

export default function Hero({ user }) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <section className="max-w-7xl mx-auto px-8 mt-10">

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 shadow-2xl">

        {/* Decorative Circles */}

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full"></div>

        <div className="absolute -bottom-24 left-0 w-60 h-60 bg-white/10 rounded-full"></div>

        <div className="grid lg:grid-cols-2 gap-10 items-center p-12">

          {/* Left */}

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">

              <Sprout className="text-white" size={18} />

              <span className="text-white text-sm">
                AI Powered Agriculture Platform
              </span>

            </div>

            <h1 className="text-5xl font-extrabold leading-tight text-white">

              {greeting},

              <br />

              {user.full_name} 🌾

            </h1>

            <p className="mt-6 text-lg text-green-100 leading-8 max-w-xl">

              YieldSense AI helps farmers make smarter decisions using
              Artificial Intelligence, Crop Analytics, Weather
              Intelligence and Predictive Yield Forecasting.

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <button className="bg-white text-green-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2">

                Predict Yield

                <ArrowRight size={18} />

              </button>

              <button className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white/20 transition">

                View Profile

              </button>

            </div>

          </div>

          {/* Right */}

          <div className="relative z-10">

            <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-white mb-8">

                Platform Overview

              </h2>

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-white/10 rounded-2xl p-5">

                  <BarChart3
                    className="text-white mb-3"
                    size={34}
                  />

                  <p className="text-green-100 text-sm">

                    Yield Prediction

                  </p>

                  <h3 className="text-white font-bold mt-1">

                    Machine Learning

                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-5">

                  <CloudSun
                    className="text-white mb-3"
                    size={34}
                  />

                  <p className="text-green-100 text-sm">

                    Weather

                  </p>

                  <h3 className="text-white font-bold mt-1">

                    Real-time Forecast

                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-5">

                  <Wheat
                    className="text-white mb-3"
                    size={34}
                  />

                  <p className="text-green-100 text-sm">

                    Recommendation

                  </p>

                  <h3 className="text-white font-bold mt-1">

                    Smart Crop Selection

                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-5">

                  <MapPin
                    className="text-white mb-3"
                    size={34}
                  />

                  <p className="text-green-100 text-sm">

                    Location

                  </p>

                  <h3 className="text-white font-bold mt-1">

                    Andhra Pradesh

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}