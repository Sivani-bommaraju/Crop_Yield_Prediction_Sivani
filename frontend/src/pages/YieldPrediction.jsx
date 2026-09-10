
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

    // ==========================================
    // STATE
    // ==========================================

    const [prediction, setPrediction] = useState(null);

    const [cropRecommendations, setCropRecommendations] =
        useState([]);

    const [recommendationLoading, setRecommendationLoading] =
        useState(false);

    const [recommendationMessage, setRecommendationMessage] =
        useState("");

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [predictionLoading, setPredictionLoading] =
        useState(false);

    // Active section
    const [activeSection, setActiveSection] =
        useState("yield");


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
    // LOAD SECTION FROM URL HASH
    // ==========================================

    useEffect(() => {

        const updateFromHash = () => {

            const hash =
                window.location.hash.replace("#", "");

            const validSections = [
                "yield",
                "weather",
                "soil",
                "crop",
            ];

            if (validSections.includes(hash)) {
                setActiveSection(hash);

                setTimeout(() => {

                    const element =
                        document.getElementById(
                            `section-${hash}`
                        );

                    if (element) {
                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }

                }, 100);
            }

        };

        updateFromHash();

        window.addEventListener(
            "hashchange",
            updateFromHash
        );

        return () => {
            window.removeEventListener(
                "hashchange",
                updateFromHash
            );
        };

    }, []);


    // ==========================================
    // CHANGE SECTION
    // ==========================================

    const changeSection = (section) => {

        setActiveSection(section);

        window.history.replaceState(
            null,
            "",
            `/prediction#${section}`
        );

        setTimeout(() => {

            const element =
                document.getElementById(
                    `section-${section}`
                );

            if (element) {

                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            }

        }, 50);

    };


    // ==========================================
    // LOAD FARMER PROFILE
    // ==========================================

    useEffect(() => {

        const loadFarmerProfile = async () => {

            try {

                const profile =
                    await getFarmerProfile();

                console.log(
                    "Farmer profile:",
                    profile
                );

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
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

    };


    // ==========================================
    // CROP RECOMMENDATIONS
    // ==========================================

    const getCropRecommendations = async () => {

        setRecommendationLoading(true);

        setRecommendationMessage("");

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/farmer/recommendations`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

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

            const result =
                await predictYield({

                    ...formData,

                    Crop_Year:
                        Number(
                            formData.Crop_Year
                        ),

                    Annual_Rainfall:
                        Number(
                            formData.Annual_Rainfall
                        ),

                    Fertilizer:
                        Number(
                            formData.Fertilizer
                        ),

                    Pesticide:
                        Number(
                            formData.Pesticide
                        ),

                    Avg_Temperature:
                        Number(
                            formData.Avg_Temperature
                        ),

                    Max_Temperature:
                        Number(
                            formData.Max_Temperature
                        ),

                    Min_Temperature:
                        Number(
                            formData.Min_Temperature
                        ),

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

            // Show yield section first
            changeSection("yield");

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


    // ==========================================
    // SECTION NAVIGATION
    // ==========================================

    const sections = [

        {
            id: "yield",
            label: "Yield Prediction",
            icon: <BarChart3 size={17} />,
        },

        {
            id: "weather",
            label: "Weather Analysis",
            icon: <CloudSun size={17} />,
        },

        {
            id: "soil",
            label: "Soil Analysis",
            icon: <FlaskConical size={17} />,
        },

        {
            id: "crop",
            label: "Crop Recommendation",
            icon: <Leaf size={17} />,
        },

    ];


    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-50
            via-green-50
            to-lime-100
        ">

            <Navbar
                user={user}
                logout={logout}
            />


            {/* ========================================
                HERO
            ======================================== */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                lg:px-8
                mt-10
            ">

                <div className="
                    rounded-3xl
                    bg-gradient-to-r
                    from-green-700
                    via-emerald-600
                    to-lime-600
                    shadow-2xl
                    p-10
                    lg:p-12
                ">

                    <div className="flex items-center gap-3">

                        <Sprout
                            className="text-white"
                            size={24}
                        />

                        <span className="
                            bg-white/20
                            px-4
                            py-2
                            rounded-full
                            text-white
                            text-sm
                        ">

                            AI Powered Prediction

                        </span>

                    </div>

                    <h1 className="
                        text-4xl
                        lg:text-5xl
                        font-bold
                        text-white
                        mt-8
                    ">

                        Crop Yield Prediction

                    </h1>

                    <p className="
                        text-green-100
                        mt-5
                        text-lg
                        max-w-3xl
                    ">

                        Predict crop yield using Machine Learning
                        based on your farm, soil and weather conditions.

                    </p>

                </div>

            </section>


            {/* ========================================
                PROFILE STATUS
            ======================================== */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                lg:px-8
                mt-8
            ">

                {loadingProfile ? (

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow
                        p-5
                        text-gray-600
                        flex
                        items-center
                        gap-3
                    ">

                        <Loader2
                            className="animate-spin"
                            size={20}
                        />

                        Loading your farm profile...

                    </div>

                ) : (

                    <div className="
                        bg-green-50
                        border
                        border-green-200
                        rounded-2xl
                        p-5
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <CheckCircle2
                                className="text-green-700"
                                size={22}
                            />

                            <div>

                                <h3 className="
                                    font-bold
                                    text-green-800
                                ">

                                    Farmer Profile Connected

                                </h3>

                                <p className="
                                    text-green-700
                                    text-sm
                                ">

                                    Soil, crop and farm information
                                    has been automatically loaded
                                    from your profile.

                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </section>


            {/* ========================================
                PREDICTION FORM
            ======================================== */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                lg:px-8
                mt-10
            ">

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-8
                    lg:p-10
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-8
                    ">

                        <div className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-green-50
                            flex
                            items-center
                            justify-center
                        ">

                            <BrainCircuit
                                className="text-green-700"
                                size={27}
                            />

                        </div>

                        <div>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                            ">

                                Prediction Details

                            </h2>

                            <p className="
                                text-gray-500
                                text-sm
                                mt-1
                            ">

                                Values from your farmer profile
                                are automatically populated.

                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-6
                        "
                    >

                        {Object.keys(formData).map((key) => (

                            <div key={key}>

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">

                                    {key.replaceAll(
                                        "_",
                                        " "
                                    )}

                                </label>

                                <input
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        mt-2
                                        rounded-xl
                                        border
                                        border-gray-300
                                        p-3.5
                                        focus:ring-2
                                        focus:ring-green-500
                                        focus:border-green-500
                                        outline-none
                                        transition
                                    "
                                />

                            </div>

                        ))}


                        <div className="
                            sm:col-span-2
                            lg:col-span-3
                        ">

                            <button
                                type="submit"
                                disabled={
                                    loadingProfile ||
                                    predictionLoading
                                }
                                className="
                                    w-full
                                    mt-3
                                    bg-green-700
                                    hover:bg-green-800
                                    disabled:bg-gray-400
                                    text-white
                                    font-semibold
                                    py-4
                                    rounded-xl
                                    transition
                                    shadow-sm
                                "
                            >

                                {predictionLoading ? (

                                    <span className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    ">

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
                SECTION NAVIGATION BAR
            ======================================== */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                lg:px-8
                mt-8
            ">

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    border
                    border-gray-100
                    p-2
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-2
                ">

                    {sections.map((section) => (

                        <button
                            key={section.id}
                            onClick={() =>
                                changeSection(
                                    section.id
                                )
                            }
                            className={`
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-3.5
                                rounded-xl
                                text-sm
                                font-semibold
                                transition-all
                                duration-200
                                ${
                                    activeSection ===
                                    section.id

                                        ? "bg-green-700 text-white shadow-md"

                                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                }
                            `}
                        >

                            {section.icon}

                            {section.label}

                        </button>

                    ))}

                </div>

            </section>


            {/* ========================================
                SELECTED SECTION
            ======================================== */}

            <section
                id={`section-${activeSection}`}
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    lg:px-8
                    mt-8
                    mb-20
                "
            >

                {/* ====================================
                    YIELD PREDICTION
                ==================================== */}

                {activeSection === "yield" && (

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-xl
                        overflow-hidden
                    ">

                        <div className="
                            px-8
                            lg:px-10
                            py-7
                            border-b
                            border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-green-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <BarChart3
                                        className="text-green-700"
                                        size={26}
                                    />

                                </div>

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        Yield Prediction

                                    </h2>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        mt-1
                                    ">

                                        AI-generated crop yield
                                        prediction.

                                    </p>

                                </div>

                            </div>

                        </div>


                        {!prediction ? (

                            <div className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                py-16
                                px-6
                            ">

                                <BarChart3
                                    size={42}
                                    className="
                                        text-green-400
                                        mb-5
                                    "
                                />

                                <h3 className="
                                    font-bold
                                    text-lg
                                    text-gray-800
                                ">

                                    No yield prediction yet

                                </h3>

                                <p className="
                                    text-gray-500
                                    text-sm
                                    mt-2
                                ">

                                    Submit the farm details above
                                    to generate your yield prediction.

                                </p>

                            </div>

                        ) : (

                            <div className="p-8 lg:p-10">

                                {/* =====================================
                                    YIELD + AGRICULTURAL INSIGHTS
                                ====================================== */}

                                <div className="
                                    grid
                                    lg:grid-cols-2
                                    gap-6
                                    max-w-5xl
                                    mx-auto
                                ">

                                    {/* ==============================
                                        PREDICTED YIELD
                                    ============================== */}

                                    <div className="
                                        rounded-2xl
                                        bg-green-50
                                        border
                                        border-green-100
                                        p-8
                                        flex
                                        flex-col
                                        justify-center
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">

                                            <Sprout
                                                size={22}
                                                className="text-green-700"
                                            />

                                            <h3 className="
                                                font-bold
                                                text-lg
                                                text-green-700
                                            ">

                                                Predicted Yield

                                            </h3>

                                        </div>

                                        <div className="mt-5">

                                            <h1 className="
                                                text-5xl
                                                font-bold
                                                text-gray-900
                                            ">

                                                {Number(
                                                    prediction.predicted_yield
                                                ).toFixed(3)}

                                            </h1>

                                            <p className="
                                                text-gray-600
                                                mt-2
                                            ">

                                                tonnes / hectare

                                            </p>

                                        </div>

                                    </div>


                                    {/* ==============================
                                        AGRICULTURAL INSIGHTS
                                    ============================== */}

                                    <div className="
                                        rounded-2xl
                                        bg-white
                                        border
                                        border-gray-200
                                        p-8
                                        shadow-sm
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-6
                                        ">

                                            <Lightbulb
                                                size={22}
                                                className="text-amber-500"
                                            />

                                            <div>

                                                <h3 className="
                                                    font-bold
                                                    text-lg
                                                    text-gray-900
                                                ">

                                                    Agricultural Insights

                                                </h3>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">

                                                    AI-generated farm insights

                                                </p>

                                            </div>

                                        </div>


                                        {/* Yield Outlook */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                            border-b
                                            border-gray-100
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <BarChart3
                                                    size={17}
                                                    className="text-green-600"
                                                />

                                                <span className="
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    Yield Outlook

                                                </span>

                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold
                                                text-green-700
                                            ">

                                                {Number(
                                                    prediction.predicted_yield
                                                ) >= 3

                                                    ? "High"

                                                    : Number(
                                                        prediction.predicted_yield
                                                    ) >= 2

                                                        ? "Moderate"

                                                        : "Low"}

                                            </span>

                                        </div>


                                        {/* Weather Impact */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                            border-b
                                            border-gray-100
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <CloudSun
                                                    size={17}
                                                    className="text-blue-600"
                                                />

                                                <span className="
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    Weather Impact

                                                </span>

                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold
                                                text-blue-700
                                            ">

                                                {prediction.weather
                                                    ?.temperature_status ||
                                                    "Favorable"}

                                            </span>

                                        </div>


                                        {/* Soil Condition */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                            border-b
                                            border-gray-100
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <FlaskConical
                                                    size={17}
                                                    className="text-yellow-600"
                                                />

                                                <span className="
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    Soil Condition

                                                </span>

                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold
                                                text-yellow-700
                                            ">

                                                {prediction.soil
                                                    ?.quality ||
                                                    "Good"}

                                            </span>

                                        </div>


                                        {/* Forecast */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            py-3
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <Sprout
                                                    size={17}
                                                    className="text-green-600"
                                                />

                                                <span className="
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    Forecast

                                                </span>

                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold
                                                text-green-700
                                            ">

                                                {Number(
                                                    prediction.predicted_yield
                                                ) >= 3

                                                    ? "Positive"

                                                    : Number(
                                                        prediction.predicted_yield
                                                    ) >= 2

                                                        ? "Stable"

                                                        : "Needs Attention"}

                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================
                                    AGRICULTURAL FORECAST REPORT
                                ================================== */}

                                <div className="
                                    max-w-5xl
                                    mx-auto
                                    mt-6
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-green-50
                                    to-lime-50
                                    border
                                    border-green-100
                                    p-6
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-4
                                    ">

                                        <div className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-white
                                            flex
                                            items-center
                                            justify-center
                                            shadow-sm
                                        ">

                                            <BrainCircuit
                                                size={21}
                                                className="text-green-700"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="
                                                font-bold
                                                text-gray-900
                                            ">

                                                Agricultural Forecast Report

                                            </h3>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            ">

                                                Summary based on your
                                                current farm conditions

                                            </p>

                                        </div>

                                    </div>


                                    <div className="
                                        grid
                                        md:grid-cols-3
                                        gap-4
                                    ">

                                        {/* Expected Yield */}

                                        <div className="
                                            bg-white
                                            rounded-xl
                                            p-4
                                            border
                                            border-green-100
                                        ">

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">

                                                Expected Yield

                                            </p>

                                            <p className="
                                                text-lg
                                                font-bold
                                                text-green-700
                                                mt-1
                                            ">

                                                {Number(
                                                    prediction.predicted_yield
                                                ).toFixed(3)}

                                                <span className="
                                                    text-xs
                                                    font-normal
                                                    text-gray-500
                                                    ml-1
                                                ">

                                                    t/ha

                                                </span>

                                            </p>

                                        </div>


                                        {/* Weather */}

                                        <div className="
                                            bg-white
                                            rounded-xl
                                            p-4
                                            border
                                            border-green-100
                                        ">

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">

                                                Weather

                                            </p>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-blue-700
                                                mt-1
                                            ">

                                                {prediction.weather
                                                    ?.rainfall_status ||
                                                    "Favorable"}

                                            </p>

                                        </div>


                                        {/* Soil Quality */}

                                        <div className="
                                            bg-white
                                            rounded-xl
                                            p-4
                                            border
                                            border-green-100
                                        ">

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">

                                                Soil Quality

                                            </p>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-yellow-700
                                                mt-1
                                            ">

                                                {prediction.soil
                                                    ?.quality ||
                                                    "Good"}

                                            </p>

                                        </div>

                                    </div>


                                    {/* AI INSIGHT */}

                                    <div className="
                                        mt-5
                                        pt-5
                                        border-t
                                        border-green-100
                                    ">

                                        <div className="
                                            flex
                                            items-start
                                            gap-3
                                        ">

                                            <Lightbulb
                                                size={19}
                                                className="
                                                    text-amber-500
                                                    mt-0.5
                                                    flex-shrink-0
                                                "
                                            />

                                            <p className="
                                                text-sm
                                                text-gray-600
                                                leading-relaxed
                                            ">

                                                Based on the current
                                                prediction of{" "}

                                                <span className="
                                                    font-semibold
                                                    text-gray-900
                                                ">

                                                    {Number(
                                                        prediction.predicted_yield
                                                    ).toFixed(3)}
                                                    {" "}
                                                    tonnes/hectare

                                                </span>

                                                , your farm shows a{" "}

                                                <span className="
                                                    font-semibold
                                                    text-green-700
                                                ">

                                                    {Number(
                                                        prediction.predicted_yield
                                                    ) >= 3

                                                        ? "positive"

                                                        : Number(
                                                            prediction.predicted_yield
                                                        ) >= 2

                                                            ? "stable"

                                                            : "cautious"}

                                                </span>

                                                {" "}yield outlook. Continue
                                                monitoring weather, soil
                                                nutrients and irrigation
                                                conditions to maintain
                                                optimal crop productivity.

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* ====================================
                    WEATHER
                ==================================== */}

                {activeSection === "weather" && (

                    <div
                        id="section-weather"
                        className="
                            bg-white
                            rounded-3xl
                            shadow-xl
                            overflow-hidden
                        "
                    >

                        <div className="
                            px-8
                            lg:px-10
                            py-7
                            border-b
                            border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-blue-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <CloudSun
                                        className="text-blue-600"
                                        size={26}
                                    />

                                </div>

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        Weather Analysis

                                    </h2>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        mt-1
                                    ">

                                        Analyse weather conditions
                                        affecting crop growth.

                                    </p>

                                </div>

                            </div>

                        </div>


                        {!prediction ? (

                            <div className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                py-16
                            ">

                                <CloudSun
                                    size={42}
                                    className="
                                        text-blue-300
                                        mb-5
                                    "
                                />

                                <p className="
                                    text-gray-500
                                    text-sm
                                ">

                                    Weather analysis will appear
                                    after prediction.

                                </p>

                            </div>

                        ) : (

                            <div className="p-8 lg:p-10">

                                <div className="
                                    max-w-3xl
                                    mx-auto
                                    rounded-2xl
                                    bg-blue-50
                                    border
                                    border-blue-100
                                    p-8
                                ">

                                    <div className="
                                        grid
                                        sm:grid-cols-2
                                        gap-5
                                    ">

                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Average Temperature

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                text-gray-900
                                                mt-1
                                            ">

                                                {
                                                    prediction.weather
                                                        .average_temperature
                                                }°C

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Average Rainfall

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                text-gray-900
                                                mt-1
                                            ">

                                                {
                                                    prediction.weather
                                                        .average_rainfall
                                                } mm

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Average Humidity

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                text-gray-900
                                                mt-1
                                            ">

                                                {
                                                    prediction.weather
                                                        .average_humidity
                                                }%

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Rainfall Status

                                            </p>

                                            <p className="
                                                font-semibold
                                                text-blue-700
                                                mt-1
                                            ">

                                                {
                                                    prediction.weather
                                                        .rainfall_status
                                                }

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Temperature Status

                                            </p>

                                            <p className="
                                                font-semibold
                                                text-blue-700
                                                mt-1
                                            ">

                                                {
                                                    prediction.weather
                                                        .temperature_status
                                                }

                                            </p>

                                        </div>


                                        <div className="
                                            sm:col-span-2
                                            pt-4
                                            border-t
                                            border-blue-100
                                        ">

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                            ">

                                                Weather Impact

                                            </p>

                                            <p className="
                                                text-sm
                                                text-gray-600
                                                mt-2
                                            ">

                                                {
                                                    prediction.weather
                                                        .impact
                                                }

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* ====================================
                    SOIL
                ==================================== */}

                {activeSection === "soil" && (

                    <div
                        id="section-soil"
                        className="
                            bg-white
                            rounded-3xl
                            shadow-xl
                            overflow-hidden
                        "
                    >

                        <div className="
                            px-8
                            lg:px-10
                            py-7
                            border-b
                            border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-yellow-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FlaskConical
                                        className="
                                            text-yellow-600
                                        "
                                        size={26}
                                    />

                                </div>

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        Soil Analysis

                                    </h2>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        mt-1
                                    ">

                                        Analyse soil nutrients,
                                        pH and soil quality.

                                    </p>

                                </div>

                            </div>

                        </div>


                        {!prediction ? (

                            <div className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                py-16
                            ">

                                <FlaskConical
                                    size={42}
                                    className="
                                        text-yellow-400
                                        mb-5
                                    "
                                />

                                <p className="
                                    text-gray-500
                                    text-sm
                                ">

                                    Soil analysis will appear
                                    after prediction.

                                </p>

                            </div>

                        ) : (

                            <div className="p-8 lg:p-10">

                                <div className="
                                    max-w-3xl
                                    mx-auto
                                    rounded-2xl
                                    bg-yellow-50
                                    border
                                    border-yellow-100
                                    p-8
                                ">

                                    <div className="
                                        grid
                                        sm:grid-cols-2
                                        gap-5
                                    ">

                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Nitrogen

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .nitrogen
                                                }

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Phosphorus

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .phosphorus
                                                }

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Potassium

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .potassium
                                                }

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                pH

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .ph
                                                }

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Soil Score

                                            </p>

                                            <p className="
                                                text-xl
                                                font-bold
                                                text-yellow-700
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .soil_score
                                                }/100

                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                Quality

                                            </p>

                                            <p className="
                                                font-semibold
                                                text-yellow-700
                                                mt-1
                                            ">

                                                {
                                                    prediction.soil
                                                        .quality
                                                }

                                            </p>

                                        </div>


                                        <div className="
                                            sm:col-span-2
                                            pt-4
                                            border-t
                                            border-yellow-100
                                        ">

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                            ">

                                                Soil Recommendation

                                            </p>

                                            <p className="
                                                text-sm
                                                text-gray-600
                                                mt-2
                                            ">

                                                {
                                                    prediction.soil
                                                        .recommendation
                                                }

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* ====================================
                    CROP RECOMMENDATION
                ==================================== */}

                {activeSection === "crop" && (

                    <div
                        id="section-crop"
                        className="
                            bg-white
                            rounded-3xl
                            shadow-xl
                            overflow-hidden
                        "
                    >

                        <div className="
                            px-8
                            lg:px-10
                            py-7
                            border-b
                            border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-green-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Leaf
                                        className="
                                            text-green-700
                                        "
                                        size={25}
                                    />

                                </div>

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        Recommended Crops

                                    </h2>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        mt-1
                                    ">

                                        AI-powered crop recommendations
                                        based on your soil and rainfall
                                        conditions.

                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-8 lg:p-10">

                            {recommendationLoading ? (

                                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    py-12
                                    text-gray-500
                                ">

                                    <Loader2
                                        className="
                                            animate-spin
                                            text-green-700
                                            mb-4
                                        "
                                        size={30}
                                    />

                                    <p className="font-medium">

                                        Generating crop
                                        recommendations...

                                    </p>

                                    <p className="
                                        text-sm
                                        mt-1
                                    ">

                                        Analysing your soil
                                        and farm conditions.

                                    </p>

                                </div>

                            ) : cropRecommendations.length > 0 ? (

                                <div className="
                                    grid
                                    md:grid-cols-2
                                    lg:grid-cols-3
                                    gap-5
                                ">

                                    {cropRecommendations.map(
                                        (item, index) => (

                                            <div
                                                key={index}
                                                className="
                                                    group
                                                    rounded-2xl
                                                    border
                                                    border-green-100
                                                    bg-green-50/40
                                                    p-5
                                                    hover:shadow-md
                                                    hover:border-green-200
                                                    transition
                                                "
                                            >

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div className="
                                                            w-11
                                                            h-11
                                                            rounded-xl
                                                            bg-white
                                                            flex
                                                            items-center
                                                            justify-center
                                                            shadow-sm
                                                        ">

                                                            <Sprout
                                                                size={22}
                                                                className="
                                                                    text-green-700
                                                                "
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="
                                                                font-bold
                                                                text-gray-900
                                                                capitalize
                                                            ">

                                                                {
                                                                    item.crop
                                                                }

                                                            </p>

                                                            <p className="
                                                                text-xs
                                                                text-gray-500
                                                                mt-0.5
                                                            ">

                                                                AI recommended
                                                                crop

                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="
                                                        text-right
                                                    ">

                                                        <p className="
                                                            text-xl
                                                            font-bold
                                                            text-green-700
                                                        ">

                                                            {
                                                                item.confidence
                                                            }%

                                                        </p>

                                                        <p className="
                                                            text-xs
                                                            text-gray-500
                                                        ">

                                                            confidence

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="mt-5">

                                                    <div className="
                                                        flex
                                                        justify-between
                                                        text-xs
                                                        text-gray-500
                                                        mb-2
                                                    ">

                                                        <span>
                                                            Recommendation
                                                            strength
                                                        </span>

                                                        <span>
                                                            {
                                                                item.confidence
                                                            }%
                                                        </span>

                                                    </div>

                                                    <div className="
                                                        w-full
                                                        h-2
                                                        bg-white
                                                        rounded-full
                                                        overflow-hidden
                                                    ">

                                                        <div
                                                            className="
                                                                h-full
                                                                bg-green-600
                                                                rounded-full
                                                                transition-all
                                                                duration-700
                                                            "
                                                            style={{
                                                                width:
                                                                    `${Math.min(
                                                                        Number(
                                                                            item.confidence
                                                                        ),
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

                                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                    py-12
                                ">

                                    <div className="
                                        w-16
                                        h-16
                                        rounded-2xl
                                        bg-green-50
                                        flex
                                        items-center
                                        justify-center
                                        mb-5
                                    ">

                                        <Leaf
                                            size={30}
                                            className="
                                                text-green-600
                                            "
                                        />

                                    </div>

                                    <h3 className="
                                        font-bold
                                        text-lg
                                        text-gray-800
                                    ">

                                        No recommendations yet

                                    </h3>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        max-w-lg
                                        mt-2
                                    ">

                                        {recommendationMessage ||
                                            "Submit the prediction form to generate AI-powered crop recommendations."
                                        }

                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                )}

            </section>


            <Footer />

        </div>
    );
}