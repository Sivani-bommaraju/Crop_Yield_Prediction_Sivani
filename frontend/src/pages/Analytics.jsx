import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Sprout,
  TrendingUp,
  Map,
  ShieldCheck,
  CloudRain,
  Thermometer,
  Droplets,
  FlaskConical,
  Lightbulb,
  BarChart3,
  CalendarDays,
  Activity,
  Target,
  Leaf,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";


export default function Analytics() {

  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  const [season, setSeason] = useState("6 Months");

  const [activeTab, setActiveTab] =
    useState("overview");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // FETCH ANALYTICS
  // =========================================================

  const fetchAnalytics = async (period = season) => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/analytics/dashboard?period=${encodeURIComponent(period)}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
          "Unable to load analytics."
        );
      }


      const data =
        await response.json();

      setAnalytics(data);

    } catch (err) {

      console.error(
        "Analytics error:",
        err
      );

      setError(
        err.message ||
        "Unable to load analytics dashboard."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchAnalytics(
      "6 Months"
    );

  }, []);


  // =========================================================
  // PERIOD CHANGE
  // =========================================================

  const handlePeriodChange = (e) => {

    const value =
      e.target.value;

    setSeason(value);

    fetchAnalytics(value);

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

        <Navbar
          user={user}
          logout={logout}
        />

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">

            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />

            <h2 className="text-xl font-bold text-gray-800 mt-6">
              Loading Analytics
            </h2>

            <p className="text-gray-500 mt-2">
              Analyzing your farm data...
            </p>

          </div>

        </div>

      </div>

    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

        <Navbar
          user={user}
          logout={logout}
        />

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">

            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">

              <ShieldCheck
                className="text-red-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              Analytics Unavailable
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <button
              onClick={() =>
                fetchAnalytics(season)
              }
              className="mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>

    );
  }


  // =========================================================
  // BACKEND DATA
  // =========================================================

  const stats =
    analytics?.stats || {};

  const yieldTrend =
    analytics?.yield_trend || [];

  const seasonalData =
    analytics?.seasonal_data || [];

  const cropData =
    analytics?.crop_data || [];

  const weatherData =
    analytics?.weather_data || [];

  const risk =
    analytics?.risk || {};

  const suggestions =
    analytics?.suggestions || [];


  // =========================================================
  // HELPER
  // =========================================================

  const getWeatherImpact = (factor) => {

    const item =
      weatherData.find(
        (x) =>
          x.factor === factor
      );

    return item
      ? item.impact
      : 0;
  };


  // =========================================================
  // KPI DATA
  // =========================================================

  const bestCrop =
    stats.best_crop &&
    stats.best_crop !== "N/A"
      ? stats.best_crop
      : "N/A";


  const kpis = [

    {
      title: "Average Yield",
      value:
        stats.average_yield ??
        0,
      unit: "t/ha",
      change:
        stats.prediction_count > 0
          ? `${stats.prediction_count} predictions`
          : "No predictions yet",
      positive:
        stats.average_yield > 0,
      icon: Sprout,
      bg: "bg-green-50",
      iconColor: "text-green-700",
    },

    {
      title: "Productivity Score",
      value:
        `${stats.productivity_score ?? 0}%`,
      unit: "Score",
      change:
        stats.productivity_score >= 70
          ? "Good productivity"
          : "Needs improvement",
      positive:
        stats.productivity_score >= 70,
      icon: TrendingUp,
      bg: "bg-blue-50",
      iconColor: "text-blue-700",
    },

    {
      title: "Best Performing Crop",
      value:
        bestCrop,
      unit:
        stats.best_crop_yield
          ? `${stats.best_crop_yield} t/ha`
          : "No data",
      change:
        bestCrop !== "N/A"
          ? "Top crop"
          : "No crop data",
      positive:
        bestCrop !== "N/A",
      icon: Leaf,
      bg: "bg-lime-50",
      iconColor: "text-lime-700",
    },

    {
      title: "Farm Risk",
      value:
        risk.level ||
        "UNKNOWN",
      unit:
        `${risk.overall ?? 0}/100`,
      change:
        risk.level === "LOW"
          ? "Stable"
          : "Requires attention",
      positive:
        risk.level === "LOW",
      icon: ShieldCheck,
      bg:
        risk.level === "LOW"
          ? "bg-emerald-50"
          : "bg-yellow-50",
      iconColor:
        risk.level === "LOW"
          ? "text-emerald-700"
          : "text-yellow-700",
    },

  ];


  // =========================================================
  // TABS
  // =========================================================

  const tabs = [

    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
    },

    {
      id: "environment",
      label: "Environment",
      icon: CloudRain,
    },

    {
      id: "productivity",
      label: "Productivity",
      icon: Target,
    },

    {
      id: "risk",
      label: "Risk & Forecast",
      icon: ShieldCheck,
    },

  ];


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

      <Navbar
        user={user}
        logout={logout}
      />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">

        <div className="rounded-3xl bg-gradient-to-r from-green-800 via-emerald-700 to-lime-600 shadow-2xl p-8 lg:p-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">

                  <BarChart3
                    className="text-white"
                    size={24}
                  />

                </div>

                <span className="text-green-100 font-medium">
                  Agricultural Intelligence
                </span>

              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Analytics Dashboard
              </h1>

              <p className="text-green-100 mt-3 max-w-2xl">
                Understand your farm's productivity,
                environmental conditions, risks and
                future yield potential.
              </p>

            </div>


            {/* PERIOD */}

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">

              <div className="flex items-center gap-3">

                <CalendarDays
                  className="text-white"
                  size={20}
                />

                <div>

                  <p className="text-xs text-green-100">
                    Analysis Period
                  </p>

                  <select
                    value={season}
                    onChange={handlePeriodChange}
                    className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                  >

                    <option
                      value="6 Months"
                      className="text-gray-800"
                    >
                      6 Months
                    </option>

                    <option
                      value="1 Year"
                      className="text-gray-800"
                    >
                      1 Year
                    </option>

                    <option
                      value="3 Years"
                      className="text-gray-800"
                    >
                      3 Years
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TABS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-wrap gap-2">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (

              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  flex items-center gap-2
                  px-5 py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition
                  ${
                    activeTab === tab.id
                      ? "bg-green-700 text-white shadow"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }
                `}
              >

                <Icon size={18} />

                {tab.label}

              </button>

            );

          })}

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {kpis.map((kpi) => {

            const Icon = kpi.icon;

            return (

              <div
                key={kpi.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-gray-500 font-medium">
                      {kpi.title}
                    </p>

                    <div className="flex items-baseline gap-2 mt-3">

                      <h2 className="text-3xl font-bold text-gray-900">
                        {kpi.value}
                      </h2>

                      <span className="text-sm text-gray-500">
                        {kpi.unit}
                      </span>

                    </div>

                  </div>

                  <div
                    className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center`}
                  >

                    <Icon
                      size={22}
                      className={kpi.iconColor}
                    />

                  </div>

                </div>

                <div className="flex items-center gap-2 mt-4">

                  <span
                    className={`text-sm font-semibold ${
                      kpi.positive
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {kpi.change}
                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      {activeTab === "overview" && (

        <>

          <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">

            <div className="grid lg:grid-cols-3 gap-6">

              {/* YIELD */}

              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

                <div className="flex justify-between items-start mb-6">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Yield Performance
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Actual analytics data from your farm
                    </p>

                  </div>

                </div>

                <div className="h-[320px]">

                  {yieldTrend.length > 0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <LineChart
                        data={yieldTrend}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="year"
                        />

                        <YAxis />

                        <Tooltip />

                        <Line
                          type="monotone"
                          dataKey="yield"
                          name="Yield"
                          strokeWidth={3}
                          stroke="#16a34a"
                          dot={{ r: 5 }}
                        />

                      </LineChart>

                    </ResponsiveContainer>

                  ) : (

                    <EmptyChart
                      message="No yield predictions available for this period."
                    />

                  )}

                </div>

              </div>


              {/* CROP */}

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-gray-900">
                    Crop Productivity
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Average predicted yield by crop
                  </p>

                </div>

                <div className="h-[320px]">

                  {cropData.length > 0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={cropData}
                        layout="vertical"
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                        />

                        <YAxis
                          type="category"
                          dataKey="crop"
                          width={70}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="yield"
                          name="Yield"
                          fill="#16a34a"
                          radius={[
                            0,
                            8,
                            8,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  ) : (

                    <EmptyChart
                      message="No crop performance data available."
                    />

                  )}

                </div>

              </div>

            </div>

          </section>


          {/* SEASON + RESOURCES */}

          <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 mb-20">

            <div className="grid lg:grid-cols-2 gap-6">

              {/* SEASON */}

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Seasonal Productivity
                </h2>

                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Yield across agricultural seasons
                </p>

                <div className="h-[300px]">

                  {seasonalData.length > 0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={seasonalData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="season"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="yield"
                          name="Yield (t/ha)"
                          fill="#16a34a"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  ) : (

                    <EmptyChart
                      message="No seasonal prediction data available."
                    />

                  )}

                </div>

              </div>


              {/* WEATHER IMPACT */}

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Environmental Impact
                </h2>

                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Environmental factors affecting productivity
                </p>

                <div className="space-y-6">

                  {weatherData.map(
                    (item) => (

                      <div
                        key={item.factor}
                      >

                        <div className="flex justify-between mb-2">

                          <span className="font-medium text-gray-700">
                            {item.factor}
                          </span>

                          <span className="font-bold text-green-700">
                            {item.impact}%
                          </span>

                        </div>

                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    item.impact
                                  )
                                )}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>

        </>

      )}


      {/* =====================================================
          ENVIRONMENT
      ===================================================== */}

      {activeTab === "environment" && (

        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 mb-20">

          <div className="grid lg:grid-cols-2 gap-6">

            {/* RAINFALL */}

            <EnvironmentCard
              icon={
                <CloudRain
                  className="text-blue-600"
                  size={22}
                />
              }
              title="Rainfall Analysis"
              subtitle="Current environmental rainfall impact"
              value={getWeatherImpact("Rainfall")}
              bg="bg-blue-50"
              text="text-blue-800"
            />


            {/* TEMPERATURE */}

            <EnvironmentCard
              icon={
                <Thermometer
                  className="text-orange-600"
                  size={22}
                />
              }
              title="Temperature Analysis"
              subtitle="Current environmental temperature impact"
              value={getWeatherImpact("Temperature")}
              bg="bg-orange-50"
              text="text-orange-800"
            />


            {/* HUMIDITY */}

            <EnvironmentCard
              icon={
                <Droplets
                  className="text-cyan-600"
                  size={22}
                />
              }
              title="Humidity Analysis"
              subtitle="Humidity influence on productivity"
              value={getWeatherImpact("Humidity")}
              bg="bg-cyan-50"
              text="text-cyan-800"
            />


            {/* SOIL MOISTURE */}

            <EnvironmentCard
              icon={
                <FlaskConical
                  className="text-yellow-700"
                  size={22}
                />
              }
              title="Soil Moisture"
              subtitle="Estimated soil moisture influence"
              value={getWeatherImpact("Soil Moisture")}
              bg="bg-yellow-50"
              text="text-yellow-800"
            />

          </div>

        </section>

      )}


      {/* =====================================================
          PRODUCTIVITY
      ===================================================== */}

      {activeTab === "productivity" && (

        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 mb-20">

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">

                <Target
                  className="text-green-700"
                  size={24}
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Crop Intelligence
                </h2>

                <p className="text-gray-500">
                  AI-based crop productivity analysis
                </p>

              </div>

            </div>


            {cropData.length > 0 ? (

              <div className="grid md:grid-cols-3 gap-6">

                {cropData
                  .slice(0, 3)
                  .map(
                    (crop, index) => {

                      const score =
                        stats.best_crop_yield > 0
                          ? Math.round(
                              (
                                crop.yield /
                                stats.best_crop_yield
                              ) * 100
                            )
                          : 0;

                      return (

                        <div
                          key={crop.crop}
                          className="border border-green-100 rounded-2xl p-6 hover:shadow-md transition"
                        >

                          <div className="flex justify-between items-start">

                            <div>

                              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">

                                <Sprout
                                  className="text-green-700"
                                  size={25}
                                />

                              </div>

                              <h3 className="text-xl font-bold mt-4">
                                {crop.crop}
                              </h3>

                            </div>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                              #{index + 1}
                            </span>

                          </div>


                          <div className="mt-6">

                            <div className="flex justify-between text-sm mb-2">

                              <span className="text-gray-500">
                                Relative Performance
                              </span>

                              <span className="font-bold text-green-700">
                                {Math.min(
                                  100,
                                  score
                                )}%
                              </span>

                            </div>

                            <div className="h-3 bg-gray-100 rounded-full">

                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{
                                  width:
                                    `${Math.min(
                                      100,
                                      score
                                    )}%`,
                                }}
                              />

                            </div>

                          </div>


                          <div className="mt-6 pt-5 border-t border-gray-100">

                            <div className="flex justify-between">

                              <span className="text-gray-500 text-sm">
                                Average Yield
                              </span>

                              <span className="font-bold">
                                {crop.yield} t/ha
                              </span>

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

              </div>

            ) : (

              <EmptyChart
                message="Make some yield predictions to generate crop productivity analytics."
              />

            )}


            {/* PRODUCTIVITY INSIGHTS */}

            <div className="mt-8 grid md:grid-cols-3 gap-5">

              <div className="bg-green-50 rounded-2xl p-5">

                <TrendingUp
                  className="text-green-700"
                  size={24}
                />

                <h3 className="font-bold mt-3">
                  Productivity Score
                </h3>

                <p className="text-2xl font-bold text-green-700 mt-2">
                  {stats.productivity_score ?? 0}%
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Current calculated productivity score
                </p>

              </div>


              <div className="bg-blue-50 rounded-2xl p-5">

                <Droplets
                  className="text-blue-700"
                  size={24}
                />

                <h3 className="font-bold mt-3">
                  Water Impact
                </h3>

                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {getWeatherImpact("Rainfall")}%
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Rainfall influence score
                </p>

              </div>


              <div className="bg-lime-50 rounded-2xl p-5">

                <Activity
                  className="text-lime-700"
                  size={24}
                />

                <h3 className="font-bold mt-3">
                  Predictions
                </h3>

                <p className="text-2xl font-bold text-lime-700 mt-2">
                  {stats.prediction_count ?? 0}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Predictions in selected period
                </p>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          RISK & FORECAST
      ===================================================== */}

      {activeTab === "risk" && (

        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 mb-20">

          <div className="grid lg:grid-cols-3 gap-6">

            {/* OVERALL RISK */}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">

                  <ShieldCheck
                    className="text-green-700"
                    size={25}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Farm Risk
                  </h2>

                  <p className="text-sm text-gray-500">
                    Overall assessment
                  </p>

                </div>

              </div>


              <div className="text-center py-8">

                <div className="w-32 h-32 mx-auto rounded-full border-[12px] border-green-100 flex items-center justify-center">

                  <div>

                    <p className="text-4xl font-bold text-green-700">
                      {risk.overall ?? 0}
                    </p>

                    <p className="text-xs text-gray-500">
                      / 100
                    </p>

                  </div>

                </div>

                <h3 className="text-xl font-bold text-green-700 mt-5">
                  {risk.level || "UNKNOWN"} Risk
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Current farm risk assessment.
                </p>

              </div>

            </div>


            {/* RISK BREAKDOWN */}

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

              <h2 className="text-xl font-bold">
                Risk Assessment
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-7">
                Potential factors affecting productivity
              </p>


              <div className="space-y-5">

                <RiskRow
                  title="Weather Risk"
                  description="Rainfall and weather conditions"
                  value={risk.weather}
                  icon={
                    <CloudRain
                      className="text-green-700"
                      size={23}
                    />
                  }
                />

                <RiskRow
                  title="Soil Risk"
                  description="Nutrient and pH conditions"
                  value={risk.soil}
                  icon={
                    <FlaskConical
                      className="text-yellow-700"
                      size={23}
                    />
                  }
                />

                <RiskRow
                  title="Yield Risk"
                  description="Probability of yield reduction"
                  value={risk.yield}
                  icon={
                    <TrendingUp
                      className="text-green-700"
                      size={23}
                    />
                  }
                />

                <RiskRow
                  title="Pest Risk"
                  description="Estimated pest-related risk"
                  value={risk.pest}
                  icon={
                    <ShieldCheck
                      className="text-green-700"
                      size={23}
                    />
                  }
                />

              </div>

            </div>

          </div>


          {/* FORECAST */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mt-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <TrendingUp
                  className="text-blue-700"
                  size={24}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Yield Forecast
                </h2>

                <p className="text-sm text-gray-500">
                  Historical predicted yield trend
                </p>

              </div>

            </div>


            <div className="h-[300px]">

              {yieldTrend.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={yieldTrend}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="year"
                    />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="yield"
                      name="Predicted Yield"
                      stroke="#2563eb"
                      fill="#dbeafe"
                      strokeWidth={3}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              ) : (

                <EmptyChart
                  message="No forecast history available yet."
                />

              )}

            </div>

          </div>


          {/* AI ADVICE */}

          <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl shadow-lg p-7 mt-6 text-white">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">

                <Lightbulb
                  size={25}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  AI Optimization Advice
                </h2>

                <p className="text-green-100 text-sm">
                  Data-driven suggestions for improving productivity
                </p>

              </div>

            </div>


            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">

              {suggestions.length > 0 ? (

                suggestions.map(
                  (item) => (

                    <div
                      key={item.title}
                      className="bg-white/10 rounded-2xl p-5"
                    >

                      <h3 className="font-bold">
                        {item.title}
                      </h3>

                      <p className="text-sm text-green-100 mt-2">
                        {item.text}
                      </p>

                    </div>

                  )
                )

              ) : (

                <div className="bg-white/10 rounded-2xl p-5 md:col-span-2 lg:col-span-4">

                  <p className="text-sm text-green-100">
                    No optimization suggestions are currently available.
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

      )}


      <Footer />

    </div>

  );
}


// =========================================================
// EMPTY CHART
// =========================================================

function EmptyChart({
  message,
}) {

  return (

    <div className="h-full flex items-center justify-center">

      <div className="text-center max-w-sm">

        <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center">

          <BarChart3
            className="text-green-600"
            size={26}
          />

        </div>

        <p className="text-gray-500 text-sm mt-4">
          {message}
        </p>

      </div>

    </div>

  );
}


// =========================================================
// ENVIRONMENT CARD
// =========================================================

function EnvironmentCard({
  icon,
  title,
  subtitle,
  value,
  bg,
  text,
}) {

  return (

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center gap-3 mb-6">

        <div
          className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>

        <div>

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>

        </div>

      </div>


      <div className="text-center py-8">

        <p
          className={`text-5xl font-bold ${text}`}
        >
          {value}%
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Environmental influence score
        </p>

      </div>


      <div className={`${bg} rounded-xl p-4`}>

        <p className={`text-sm ${text}`}>

          <strong>Analysis:</strong>{" "}
          The backend currently estimates
          this factor's influence on agricultural
          productivity.

        </p>

      </div>

    </div>

  );
}


// =========================================================
// RISK ROW
// =========================================================

function RiskRow({
  title,
  description,
  value,
  icon,
}) {

  const riskValue =
    Number(value || 0);

  const level =
    riskValue <= 30
      ? "LOW"
      : riskValue <= 60
      ? "MODERATE"
      : "HIGH";


  const badge =
    level === "LOW"
      ? "bg-green-100 text-green-700"
      : level === "MODERATE"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";


  return (

    <div className="border border-gray-100 rounded-2xl p-5">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          {icon}

          <div>

            <h3 className="font-bold">
              {title}
            </h3>

            <p className="text-xs text-gray-500">
              {description}
            </p>

          </div>

        </div>

        <div className="text-right">

          <span
            className={`${badge} px-4 py-2 rounded-full font-bold text-sm`}
          >
            {level}
          </span>

          <p className="text-xs text-gray-400 mt-2">
            {riskValue}/100
          </p>

        </div>

      </div>

    </div>

  );
}