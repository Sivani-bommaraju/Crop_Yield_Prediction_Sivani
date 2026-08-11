import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { predictYield } from "../services/predictionService";
import { getFarmerProfile } from "../services/farmerService";

import {
    Sprout,
    BrainCircuit,
    BarChart3,
    Leaf,
    Loader2,
    CheckCircle2,
    CloudSun,
    FlaskConical,
    Lightbulb,
} from "lucide-react";

export default function YieldPrediction() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const [prediction, setPrediction] = useState(null);

    const [cropRecommendations, setCropRecommendations] = useState([]);

    const [recommendationLoading, setRecommendationLoading] =
        useState(false);

    const [recommendationMessage, setRecommendationMessage] =
        useState("");

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [predictionLoading, setPredictionLoading] =
        useState(false);


    // ==========================================
    // FORM DATA
    // ==========================================

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


    // ==========================================
    // LOAD FARMER PROFILE
    // ==========================================

    useEffect(() => {

        const loadFarmerProfile = async () => {

            try {

                const profile = await getFarmerProfile();

                console.log("Farmer profile:", profile);

                if (!profile) {
                    return;
                }

                setFormData(prev => ({

                    ...prev,

                    Crop:
                        profile.crop?.primary_crop || "",

                    Season:
                        profile.crop?.season || "",

                    State:
                        profile.farm?.state || "",

                    Annual_Rainfall:
                        profile.water?.annual_rainfall ?? "",

                    N:
                        profile.soil?.nitrogen ?? "",

                    P:
                        profile.soil?.phosphorus ?? "",

                    K:
                        profile.soil?.potassium ?? "",

                    pH:
                        profile.soil?.soil_ph ?? "",

                }));

            }

            catch (err) {

                console.log(
                    "Unable to load farmer profile:",
                    err.response?.data || err
                );

            }

            finally {

                setLoadingProfile(false);

            }

        };

        loadFarmerProfile();

    }, []);


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

    };


    // ==========================================
    // GET CROP RECOMMENDATIONS
    // ==========================================

    const getCropRecommendations = async () => {

        setRecommendationLoading(true);

        setRecommendationMessage("");

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8000/farmer/recommendations",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (
                    data?.detail?.error ===
                    "Incomplete farmer profile."
                ) {

                    setCropRecommendations([]);

                    setRecommendationMessage(
                        "Complete the required soil and rainfall information in your farmer profile to receive crop recommendations."
                    );

                } else {

                    setRecommendationMessage(
                        data?.detail?.error ||
                        "Unable to generate crop recommendations."
                    );

                }

                return;
            }

            console.log(
                "Crop recommendations:",
                data
            );

            setCropRecommendations(
                data.recommendations || []
            );

        }

        catch (err) {

            console.log(
                "Crop recommendation error:",
                err
            );

            setRecommendationMessage(
                "Unable to load crop recommendations."
            );

        }

        finally {

            setRecommendationLoading(false);

        }

    };


    // ==========================================
    // PREDICT YIELD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setPredictionLoading(true);

        try {

            const result = await predictYield({

                ...formData,

                Crop_Year:
                    Number(formData.Crop_Year),

                Annual_Rainfall:
                    Number(formData.Annual_Rainfall),

                Fertilizer:
                    Number(formData.Fertilizer),

                Pesticide:
                    Number(formData.Pesticide),

                Avg_Temperature:
                    Number(formData.Avg_Temperature),

                Max_Temperature:
                    Number(formData.Max_Temperature),

                Min_Temperature:
                    Number(formData.Min_Temperature),

                N:
                    Number(formData.N),

                P:
                    Number(formData.P),

                K:
                    Number(formData.K),

                pH:
                    Number(formData.pH),

            });

            setPrediction(result);

            // Generate crop recommendations
            await getCropRecommendations();

        }

        catch (err) {

            console.log(err);

            alert("Prediction Failed");

        }

        finally {

            setPredictionLoading(false);

        }

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };


    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

            <Navbar
                user={user}
                logout={logout}
            />


            {/* ========================================
                HERO
            ======================================== */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">

                <div className="rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 shadow-2xl p-10 lg:p-12">

                    <div className="flex items-center gap-3">

                        <Sprout
                            className="text-white"
                            size={24}
                        />

                        <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">

                            AI Powered Prediction

                        </span>

                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-white mt-8">

                        Crop Yield Prediction

                    </h1>

                    <p className="text-green-100 mt-5 text-lg max-w-3xl">

                        Predict crop yield using Machine Learning based on
                        your farm, soil and weather conditions.

                    </p>

                </div>

            </section>


            {/* ========================================
                PROFILE STATUS
            ======================================== */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">

                {loadingProfile ? (

                    <div className="bg-white rounded-2xl shadow p-5 text-gray-600 flex items-center gap-3">

                        <Loader2
                            className="animate-spin"
                            size={20}
                        />

                        Loading your farm profile...

                    </div>

                ) : (

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                            <CheckCircle2
                                className="text-green-700"
                                size={22}
                            />

                            <div>

                                <h3 className="font-bold text-green-800">

                                    Farmer Profile Connected

                                </h3>

                                <p className="text-green-700 text-sm">

                                    Soil, crop and farm information has been
                                    automatically loaded from your profile.

                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </section>


            {/* ========================================
                PREDICTION FORM
                FULL WIDTH
            ======================================== */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">

                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">

                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">

                            <BrainCircuit
                                className="text-green-700"
                                size={27}
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">

                                Prediction Details

                            </h2>

                            <p className="text-gray-500 text-sm mt-1">

                                Values from your farmer profile are
                                automatically populated.

                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >

                        {Object.keys(formData).map((key) => (

                            <div key={key}>

                                <label className="text-sm font-semibold text-gray-600">

                                    {key.replaceAll("_", " ")}

                                </label>

                                <input
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="w-full mt-2 rounded-xl border border-gray-300 p-3.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                />

                            </div>

                        ))}


                        <div className="sm:col-span-2 lg:col-span-3">

                            <button
                                type="submit"
                                disabled={
                                    loadingProfile ||
                                    predictionLoading
                                }
                                className="w-full mt-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition shadow-sm"
                            >

                                {predictionLoading ? (

                                    <span className="flex items-center justify-center gap-2">

                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Analysing Farm Data...

                                    </span>

                                ) : loadingProfile ? (

                                    "Loading Profile..."

                                ) : (

                                    "Predict Yield"

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </section>


            {/* ========================================
                PREDICTION REPORT
                FULL WIDTH BELOW FORM
            ======================================== */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* REPORT HEADER */}

                    <div className="px-8 lg:px-10 py-7 border-b border-gray-100">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">

                                <BarChart3
                                    className="text-green-700"
                                    size={26}
                                />

                            </div>

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">

                                    Prediction Report

                                </h2>

                                <p className="text-gray-500 text-sm mt-1">

                                    AI-generated analysis of your crop,
                                    weather and soil conditions.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* REPORT CONTENT */}

                    {!prediction ? (

                        <div className="flex flex-col items-center justify-center text-center py-16 px-6">

                            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">

                                <BarChart3
                                    size={30}
                                    className="text-green-600"
                                />

                            </div>

                            <h3 className="font-bold text-lg text-gray-800">

                                Your prediction report will appear here

                            </h3>

                            <p className="text-gray-500 text-sm max-w-lg mt-2">

                                Fill in the farm details above and click
                                <span className="font-semibold">
                                    {" "}Predict Yield
                                </span>
                                {" "}to generate your AI-powered report.

                            </p>

                        </div>

                    ) : (

                        <div className="p-8 lg:p-10">

                            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">


                                {/* =================================
                                    YIELD
                                ================================= */}

                                <div className="rounded-2xl bg-green-50 border border-green-100 p-6">

                                    <div className="flex items-center gap-2">

                                        <Sprout
                                            size={21}
                                            className="text-green-700"
                                        />

                                        <h3 className="font-bold text-lg text-green-700">

                                            Predicted Yield

                                        </h3>

                                    </div>

                                    <div className="mt-5">

                                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">

                                            {prediction.predicted_yield.toFixed(3)}

                                        </h1>

                                        <p className="text-gray-600 mt-2">

                                            tonnes / hectare

                                        </p>

                                    </div>

                                </div>


                                {/* =================================
                                    WEATHER
                                ================================= */}

                                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">

                                    <div className="flex items-center gap-2 mb-5">

                                        <CloudSun
                                            size={21}
                                            className="text-blue-700"
                                        />

                                        <h3 className="font-bold text-lg text-gray-900">

                                            Weather Analysis

                                        </h3>

                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700">

                                        <p>
                                            <strong>
                                                Temperature:
                                            </strong>{" "}

                                            {prediction.weather.average_temperature}
                                            °C
                                        </p>

                                        <p>
                                            <strong>
                                                Rainfall:
                                            </strong>{" "}

                                            {prediction.weather.average_rainfall}
                                            mm
                                        </p>

                                        <p>
                                            <strong>
                                                Humidity:
                                            </strong>{" "}

                                            {prediction.weather.average_humidity}
                                            %
                                        </p>

                                        <p>
                                            <strong>
                                                Rainfall:
                                            </strong>{" "}

                                            {prediction.weather.rainfall_status}

                                        </p>

                                        <p>
                                            <strong>
                                                Temperature:
                                            </strong>{" "}

                                            {prediction.weather.temperature_status}

                                        </p>

                                    </div>

                                </div>


                                {/* =================================
                                    SOIL
                                ================================= */}

                                <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-6">

                                    <div className="flex items-center gap-2 mb-5">

                                        <FlaskConical
                                            size={21}
                                            className="text-yellow-700"
                                        />

                                        <h3 className="font-bold text-lg text-gray-900">

                                            Soil Analysis

                                        </h3>

                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700">

                                        <p>
                                            <strong>
                                                Nitrogen:
                                            </strong>{" "}

                                            {prediction.soil.nitrogen}

                                        </p>

                                        <p>
                                            <strong>
                                                Phosphorus:
                                            </strong>{" "}

                                            {prediction.soil.phosphorus}

                                        </p>

                                        <p>
                                            <strong>
                                                Potassium:
                                            </strong>{" "}

                                            {prediction.soil.potassium}

                                        </p>

                                        <p>
                                            <strong>
                                                pH:
                                            </strong>{" "}

                                            {prediction.soil.ph}

                                        </p>

                                        <p>
                                            <strong>
                                                Soil Score:
                                            </strong>{" "}

                                            {prediction.soil.soil_score}/100

                                        </p>

                                        <p>
                                            <strong>
                                                Quality:
                                            </strong>{" "}

                                            {prediction.soil.quality}

                                        </p>

                                    </div>

                                </div>


                                {/* =================================
                                    AI RECOMMENDATION
                                ================================= */}

                                <div className="rounded-2xl bg-lime-50 border border-lime-100 p-6">

                                    <div className="flex items-center gap-2 mb-5">

                                        <Lightbulb
                                            size={21}
                                            className="text-green-700"
                                        />

                                        <h3 className="font-bold text-lg text-green-700">

                                            AI Recommendation

                                        </h3>

                                    </div>

                                    <div className="space-y-4 text-sm text-gray-700">

                                        <p>

                                            {prediction.weather.impact}

                                        </p>

                                        <p>

                                            {prediction.soil.recommendation}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </section>


            {/* ========================================
                RECOMMENDED CROPS
                FULL WIDTH BELOW PREDICTION REPORT
            ======================================== */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 mb-20">

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">


                    {/* HEADER */}

                    <div className="px-8 lg:px-10 py-7 border-b border-gray-100">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">

                                <Leaf
                                    className="text-green-700"
                                    size={25}
                                />

                            </div>

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">

                                    Recommended Crops

                                </h2>

                                <p className="text-gray-500 text-sm mt-1">

                                    AI-powered crop recommendations based on
                                    your soil and rainfall conditions.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-8 lg:p-10">

                        {recommendationLoading ? (

                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">

                                <Loader2
                                    className="animate-spin text-green-700 mb-4"
                                    size={30}
                                />

                                <p className="font-medium">

                                    Generating crop recommendations...

                                </p>

                                <p className="text-sm mt-1">

                                    Analysing your soil and farm conditions.

                                </p>

                            </div>

                        ) : cropRecommendations.length > 0 ? (

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                                {cropRecommendations.map(
                                    (item, index) => (

                                        <div
                                            key={index}
                                            className="rounded-2xl border border-green-100 bg-green-50/40 p-5 hover:shadow-md hover:border-green-200 transition"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">

                                                        <Sprout
                                                            size={22}
                                                            className="text-green-700"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="font-bold text-gray-900 capitalize">

                                                            {item.crop}

                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-0.5">

                                                            AI recommended crop

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="text-right">

                                                    <p className="text-xl font-bold text-green-700">

                                                        {item.confidence}%

                                                    </p>

                                                    <p className="text-xs text-gray-500">

                                                        confidence

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Confidence Bar */}

                                            <div className="mt-5">

                                                <div className="flex justify-between text-xs text-gray-500 mb-2">

                                                    <span>
                                                        Recommendation strength
                                                    </span>

                                                    <span>
                                                        {item.confidence}%
                                                    </span>

                                                </div>

                                                <div className="w-full h-2 bg-white rounded-full overflow-hidden">

                                                    <div
                                                        className="h-full bg-green-600 rounded-full transition-all duration-700"
                                                        style={{
                                                            width: `${Math.min(
                                                                Number(item.confidence),
                                                                100
                                                            )}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="flex flex-col items-center justify-center text-center py-12">

                                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">

                                    <Leaf
                                        size={30}
                                        className="text-green-600"
                                    />

                                </div>

                                <h3 className="font-bold text-lg text-gray-800">

                                    No recommendations yet

                                </h3>

                                <p className="text-gray-500 text-sm max-w-lg mt-2">

                                    {recommendationMessage ||
                                        "Complete the required soil and rainfall information in your farmer profile to receive crop recommendations."
                                    }

                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            <Footer />

        </div>
    );
}