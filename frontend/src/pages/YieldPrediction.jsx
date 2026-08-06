import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { predictYield } from "../services/predictionService";

import {
  Sprout,
  BrainCircuit,
  BarChart3,
} from "lucide-react";

export default function YieldPrediction() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [prediction, setPrediction] = useState(null);

  const [formData, setFormData] = useState({
    Crop: "",
    Crop_Year: new Date().getFullYear(),
    Season: "",
    State: "",
    Annual_Rainfall: "",
    Fertilizer: "",
    Pesticide: "",
    Avg_Temperature: "",
    Max_Temperature: "",
    Min_Temperature: "",
    N: "",
    P: "",
    K: "",
    pH: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = await predictYield({
        ...formData,
        Crop_Year: Number(formData.Crop_Year),
        Annual_Rainfall: Number(formData.Annual_Rainfall),
        Fertilizer: Number(formData.Fertilizer),
        Pesticide: Number(formData.Pesticide),
        Avg_Temperature: Number(formData.Avg_Temperature),
        Max_Temperature: Number(formData.Max_Temperature),
        Min_Temperature: Number(formData.Min_Temperature),
        N: Number(formData.N),
        P: Number(formData.P),
        K: Number(formData.K),
        pH: Number(formData.pH),
      });

      setPrediction(result);

    } catch (err) {

      console.log(err);
      alert("Prediction Failed");

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

      <Navbar
        user={user}
        logout={logout}
      />

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-8 mt-10">

        <div className="rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 shadow-2xl p-12">

          <div className="flex items-center gap-3">

            <Sprout className="text-white"/>

            <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">

              AI Powered Prediction

            </span>

          </div>

          <h1 className="text-5xl font-bold text-white mt-8">

            Crop Yield Prediction

          </h1>

          <p className="text-green-100 mt-5 text-lg max-w-3xl">

            Predict crop yield using Machine Learning based on
            soil nutrients, weather conditions and agricultural
            inputs.

          </p>

        </div>

      </section>

      {/* Main */}

      <section className="max-w-7xl mx-auto px-8 mt-14 mb-20">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-3 mb-8">

              <BrainCircuit
                className="text-green-700"
              />

              <h2 className="text-2xl font-bold">

                Prediction Details

              </h2>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >

              {Object.keys(formData).map((key) => (

                <div key={key}>

                  <label className="text-sm font-semibold text-gray-600">

                    {key.replaceAll("_"," ")}

                  </label>

                  <input

                    name={key}

                    value={formData[key]}

                    onChange={handleChange}

                    className="w-full mt-2 rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-green-500 outline-none"

                  />

                </div>

              ))}

              <div className="md:col-span-2">

                <button
                  className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl transition"
                >

                  Predict Yield

                </button>

              </div>

            </form>

          </div>

          {/* Result */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

  <div className="flex items-center gap-3">

    <BarChart3 className="text-green-700"/>

    <h2 className="text-2xl font-bold">
      Prediction Report
    </h2>

  </div>

  {!prediction ? (

    <div className="mt-10 text-center text-gray-500">

      Submit the form to generate a prediction report.

    </div>

  ) : (

    <div className="space-y-8 mt-8">

      {/* Yield */}

      <div className="rounded-2xl bg-green-50 p-6">

        <h3 className="font-bold text-xl text-green-700">

          🌾 Predicted Yield

        </h3>

        <h1 className="text-5xl font-bold mt-4">

          {prediction.predicted_yield.toFixed(3)}

        </h1>

        <p className="text-gray-600">

          tonnes / hectare

        </p>

      </div>

      {/* Weather */}

      <div className="rounded-2xl bg-blue-50 p-6">

        <h3 className="font-bold text-xl mb-4">

          🌦 Weather Analysis

        </h3>

        <div className="space-y-2 text-gray-700">

          <p>
            <strong>Average Temperature:</strong>{" "}
            {prediction.weather.average_temperature} °C
          </p>

          <p>
            <strong>Average Rainfall:</strong>{" "}
            {prediction.weather.average_rainfall} mm
          </p>

          <p>
            <strong>Average Humidity:</strong>{" "}
            {prediction.weather.average_humidity} %
          </p>

          <p>
            <strong>Rainfall Status:</strong>{" "}
            {prediction.weather.rainfall_status}
          </p>

          <p>
            <strong>Temperature Status:</strong>{" "}
            {prediction.weather.temperature_status}
          </p>

        </div>

      </div>

      {/* Soil */}

      <div className="rounded-2xl bg-yellow-50 p-6">

        <h3 className="font-bold text-xl mb-4">

          🌱 Soil Analysis

        </h3>

        <div className="space-y-2 text-gray-700">

          <p>

            <strong>Nitrogen:</strong>

            {" "}

            {prediction.soil.nitrogen}

          </p>

          <p>

            <strong>Phosphorus:</strong>

            {" "}

            {prediction.soil.phosphorus}

          </p>

          <p>

            <strong>Potassium:</strong>

            {" "}

            {prediction.soil.potassium}

          </p>

          <p>

            <strong>pH:</strong>

            {" "}

            {prediction.soil.ph}

          </p>

          <p>

            <strong>Soil Score:</strong>

            {" "}

            {prediction.soil.soil_score}/100

          </p>

          <p>

            <strong>Quality:</strong>

            {" "}

            {prediction.soil.quality}

          </p>

        </div>

      </div>

      {/* AI Recommendation */}

      <div className="rounded-2xl bg-lime-50 p-6">

        <h3 className="font-bold text-xl text-green-700">

          💡 AI Recommendation

        </h3>

        <p className="mt-3 text-gray-700">

          {prediction.weather.impact}

        </p>

        <p className="mt-3 text-gray-700">

          {prediction.soil.recommendation}

        </p>

      </div>

    </div>

  )}

</div>

        </div>

      </section>

      <Footer/>

    </div>

  );

}