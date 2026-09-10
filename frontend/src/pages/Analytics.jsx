import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Sprout,
  TrendingUp,
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
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  AlertTriangle,
  Zap,
  Gauge,
  Wind,
  ChevronRight,
  BrainCircuit,
  CircleGauge,
  TreePine,
  Download,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";


// =========================================================
// MAIN COMPONENT
// =========================================================

export default function Analytics() {
  const navigate = useNavigate();

  // =========================================================
  // USER
  // =========================================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =========================================================
  // STATE
  // =========================================================

  const [season, setSeason] = useState("6 Months");
  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ANALYTICS
  // =========================================================

  const fetchAnalytics = async (
    period = season,
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analytics/dashboard?period=${encodeURIComponent(
          period
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        const errorData =
          await response
            .json()
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
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchAnalytics("6 Months");
  }, []);

  // =========================================================
  // PERIOD CHANGE
  // =========================================================

  const handlePeriodChange = (e) => {
    const value = e.target.value;

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

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="bg-white rounded-3xl shadow-sm p-14 text-center border border-gray-100">

            <div className="relative w-16 h-16 mx-auto">

              <div className="absolute inset-0 rounded-full border-4 border-green-100" />

              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-700 animate-spin" />

              <Sprout
                className="absolute inset-0 m-auto text-green-700"
                size={25}
              />

            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-7">
              Preparing Your Farm Analytics
            </h2>

            <p className="text-gray-500 mt-2">
              Analyzing productivity,
              environmental conditions and
              farm risks...
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

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-red-100">

            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">

              <AlertTriangle
                className="text-red-600"
                size={30}
              />

            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Analytics Unavailable
            </h2>

            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              {error}
            </p>

            <button
              onClick={() =>
                fetchAnalytics(season)
              }
              className="mt-7 inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <RefreshCw size={18} />
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
  // DERIVED VALUES
  // =========================================================

  const averageYield =
    Number(
      stats.average_yield || 0
    );

  const productivityScore =
    Number(
      stats.productivity_score || 0
    );

  const predictionCount =
    Number(
      stats.prediction_count || 0
    );

  const overallRisk =
    Number(
      risk.overall || 0
    );

  const bestCrop =
    stats.best_crop &&
    stats.best_crop !== "N/A"
      ? stats.best_crop
      : "N/A";

  const bestCropYield =
    Number(
      stats.best_crop_yield || 0
    );

  // =========================================================
  // WEATHER AVERAGE
  // =========================================================

  const weatherAverage =
    weatherData.length > 0
      ? Math.round(
          weatherData.reduce(
            (sum, item) =>
              sum +
              Number(
                item.impact || 0
              ),
            0
          ) /
            weatherData.length
        )
      : 0;

  // =========================================================
  // FARM HEALTH
  // =========================================================

  const farmHealth =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          productivityScore *
            0.65 +
            (100 - overallRisk) *
              0.35
        )
      )
    );

  // =========================================================
  // WEATHER HELPER
  // =========================================================

  const getWeatherImpact = (
    factor
  ) => {
    const item =
      weatherData.find(
        (x) =>
          x.factor === factor
      );

    return item
      ? Number(
          item.impact || 0
        )
      : 0;
  };

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
  // REFRESH
  // =========================================================

  const refresh = () => {
    fetchAnalytics(
      season,
      true
    );
  };

  // =========================================================
  // EXPORT
  // =========================================================

  const exportReport = () => {
    const report = {
      generated_at:
        new Date().toISOString(),

      analysis_period:
        season,

      statistics:
        stats,

      crop_data:
        cropData,

      weather_data:
        weatherData,

      risk:
        risk,

      suggestions:
        suggestions,
    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            report,
            null,
            2
          ),
        ],
        {
          type: "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `YieldSense-Analytics-${season.replace(
        /\s/g,
        "-"
      )}.json`;

    link.click();

    URL.revokeObjectURL(
      url
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

      <Navbar
        user={user}
        logout={logout}
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 shadow-2xl">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />

          <div className="absolute -left-20 -bottom-32 w-80 h-80 bg-lime-300/10 rounded-full blur-3xl" />

          <div className="relative p-7 lg:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-green-100 text-sm mb-5">

                  <Sparkles size={15} />

                  AI-Powered Agricultural Intelligence

                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Farm Analytics
                </h1>

                <p className="text-green-100 mt-4 text-base lg:text-lg leading-relaxed">
                  Turn your farm data into actionable
                  insights. Monitor productivity,
                  environmental conditions, risks and
                  future yield potential.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">

                  <div className="flex items-center gap-2 text-sm text-green-100 bg-white/10 px-4 py-2 rounded-xl">

                    <CalendarDays size={16} />

                    {season}

                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-100 bg-white/10 px-4 py-2 rounded-xl">

                    <Activity size={16} />

                    {predictionCount} Predictions

                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-100 bg-white/10 px-4 py-2 rounded-xl">

                    <MapIcon />

                    Farm Intelligence

                  </div>

                </div>

              </div>

              {/* CONTROLS */}

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[200px]">

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
                        onChange={
                          handlePeriodChange
                        }
                        className="bg-transparent text-white font-semibold outline-none cursor-pointer mt-1"
                      >

                        <option
                          value="6 Months"
                          className="text-gray-900"
                        >
                          6 Months
                        </option>

                        <option
                          value="1 Year"
                          className="text-gray-900"
                        >
                          1 Year
                        </option>

                        <option
                          value="3 Years"
                          className="text-gray-900"
                        >
                          3 Years
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={refresh}
                    disabled={
                      refreshing
                    }
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-green-800 hover:bg-green-50 px-5 py-3 rounded-xl font-semibold transition disabled:opacity-60"
                  >

                    <RefreshCw
                      size={17}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />

                    Refresh

                  </button>

                  <button
                    onClick={
                      exportReport
                    }
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-3 rounded-xl font-semibold transition"
                    title="Export analytics"
                  >

                    <Download
                      size={17}
                    />

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          TABS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7">

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-wrap gap-2">

          {tabs.map(
            (tab) => {
              const Icon =
                tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab ===
                    tab.id
                      ? "bg-green-700 text-white shadow-lg shadow-green-700/20"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >

                  <Icon
                    size={18}
                  />

                  {tab.label}

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7">

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <KpiCard
            title="Average Yield"
            value={averageYield.toFixed(
              2
            )}
            unit="t/ha"
            description={
              predictionCount >
              0
                ? `${predictionCount} predictions analyzed`
                : "No predictions yet"
            }
            icon={Sprout}
            iconBg="bg-green-50"
            iconColor="text-green-700"
            positive={
              averageYield > 0
            }
          />

          <KpiCard
            title="Productivity Score"
            value={
              productivityScore
            }
            unit="%"
            description={
              productivityScore >=
              70
                ? "Strong farm productivity"
                : "Room for improvement"
            }
            icon={TrendingUp}
            iconBg="bg-blue-50"
            iconColor="text-blue-700"
            positive={
              productivityScore >=
              70
            }
          />

          <KpiCard
            title="Top Performing Crop"
            value={bestCrop}
            unit={
              bestCropYield >
              0
                ? `${bestCropYield} t/ha`
                : ""
            }
            description={
              bestCrop !==
              "N/A"
                ? "Highest predicted yield"
                : "No crop data"
            }
            icon={Award}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-700"
            positive={
              bestCrop !==
              "N/A"
            }
          />

          <KpiCard
            title="Farm Risk"
            value={
              risk.level ||
              "UNKNOWN"
            }
            unit={`${overallRisk}/100`}
            description={
              risk.level ===
              "LOW"
                ? "Farm conditions are stable"
                : "Some attention may be required"
            }
            icon={
              ShieldCheck
            }
            iconBg={
              risk.level ===
              "LOW"
                ? "bg-emerald-50"
                : "bg-yellow-50"
            }
            iconColor={
              risk.level ===
              "LOW"
                ? "text-emerald-700"
                : "text-yellow-700"
            }
            positive={
              risk.level ===
              "LOW"
            }
          />

        </div>

      </section>

      {/* =====================================================
          FARM HEALTH
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7">

        <div className="grid lg:grid-cols-3 gap-5">

          {/* HEALTH */}

          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Overall Farm Health
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  {farmHealth >=
                  75
                    ? "Healthy"
                    : farmHealth >=
                      50
                    ? "Moderate"
                    : "Needs Attention"}
                </h2>

              </div>

              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">

                <Gauge
                  className="text-green-700"
                  size={23}
                />

              </div>

            </div>

            <div className="flex items-center justify-center py-6">

              <div className="relative w-44 h-44">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={[
                      {
                        value:
                          farmHealth,
                      },
                    ]}
                    startAngle={
                      90
                    }
                    endAngle={
                      -270
                    }
                  >

                    <PolarAngleAxis
                      type="number"
                      domain={[
                        0,
                        100,
                      ]}
                      tick={false}
                    />

                    <RadialBar
                      dataKey="value"
                      cornerRadius={
                        20
                      }
                      fill="#16a34a"
                      background
                    />

                  </RadialBarChart>

                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-4xl font-bold text-gray-900">
                    {farmHealth}
                  </span>

                  <span className="text-xs text-gray-500">
                    / 100
                  </span>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <MiniMetric
                label="Productivity"
                value={`${productivityScore}%`}
              />

              <MiniMetric
                label="Risk"
                value={`${overallRisk}/100`}
              />

            </div>

          </div>

          {/* INTELLIGENCE */}

          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">

                  <BrainCircuit
                    className="text-purple-700"
                    size={25}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Farm Intelligence
                  </h2>

                  <p className="text-sm text-gray-500">
                    Key signals from your analytics
                  </p>

                </div>

              </div>

              <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-full">

                <Zap
                  size={13}
                />

                AI Analysis

              </span>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-7">

              <InsightCard
                icon={Award}
                title="Best Crop"
                value={
                  bestCrop
                }
                description={
                  bestCropYield >
                  0
                    ? `${bestCropYield} t/ha predicted`
                    : "No crop data"
                }
              />

              <InsightCard
                icon={
                  CloudRain
                }
                title="Environment"
                value={`${weatherAverage}%`}
                description="Average environmental influence"
              />

              <InsightCard
                icon={
                  Activity
                }
                title="Predictions"
                value={
                  predictionCount
                }
                description="Analyzed in selected period"
              />

            </div>

            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-green-50 to-lime-50 border border-green-100">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">

                  <Lightbulb
                    className="text-green-700"
                    size={19}
                  />

                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Quick Recommendation
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">

                    {suggestions.length >
                    0
                      ? suggestions[0]
                          ?.text ||
                        "Review your environmental conditions and crop performance regularly."
                      : productivityScore >=
                        70
                      ? "Your productivity is performing well. Continue monitoring environmental conditions to maintain performance."
                      : "Consider reviewing crop selection, soil conditions and environmental factors to improve productivity."}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      {activeTab ===
        "overview" && (
        <>

          {/* CHARTS */}

          <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7">

            <div className="grid lg:grid-cols-3 gap-6">

              {/* YIELD TREND */}

              <ChartCard
                title="Yield Performance"
                subtitle="Predicted yield trend across your farm"
                className="lg:col-span-2"
              >

                <div className="h-[340px]">

                  {yieldTrend.length >
                  0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <AreaChart
                        data={
                          yieldTrend
                        }
                      >

                        <defs>

                          <linearGradient
                            id="yieldGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >

                            <stop
                              offset="5%"
                              stopColor="#16a34a"
                              stopOpacity={
                                0.28
                              }
                            />

                            <stop
                              offset="95%"
                              stopColor="#16a34a"
                              stopOpacity={
                                0
                              }
                            />

                          </linearGradient>

                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={
                            false
                          }
                          stroke="#e5e7eb"
                        />

                        <XAxis
                          dataKey="year"
                          tick={{
                            fontSize: 12,
                          }}
                        />

                        <YAxis
                          tick={{
                            fontSize: 12,
                          }}
                        />

                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="yield"
                          name="Yield"
                          stroke="#16a34a"
                          fill="url(#yieldGradient)"
                          strokeWidth={
                            3
                          }
                        />

                      </AreaChart>

                    </ResponsiveContainer>

                  ) : (

                    <EmptyChart message="No yield predictions available for this period." />

                  )}

                </div>

              </ChartCard>

              {/* CROP PRODUCTIVITY */}

              <ChartCard
                title="Crop Productivity"
                subtitle="Average predicted yield by crop"
              >

                <div className="h-[340px]">

                  {cropData.length >
                  0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={
                          cropData
                        }
                        layout="vertical"
                        margin={{
                          left: 5,
                          right: 10,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={
                            false
                          }
                        />

                        <XAxis
                          type="number"
                          tick={{
                            fontSize: 11,
                          }}
                        />

                        <YAxis
                          type="category"
                          dataKey="crop"
                          width={70}
                          tick={{
                            fontSize: 11,
                          }}
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

                    <EmptyChart message="No crop performance data available." />

                  )}

                </div>

              </ChartCard>

            </div>

          </section>

          {/* CROP RANKING + ENVIRONMENT */}

          <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 mb-20">

            <div className="grid lg:grid-cols-2 gap-6">

              {/* CROP RANKING */}

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Crop Performance Ranking
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Compare predicted productivity
                    </p>

                  </div>

                  <Award
                    className="text-yellow-600"
                    size={25}
                  />

                </div>

                {cropData.length >
                0 ? (

                  <div className="space-y-4">

                    {[...cropData]
                      .sort(
                        (
                          a,
                          b
                        ) =>
                          Number(
                            b.yield ||
                              0
                          ) -
                          Number(
                            a.yield ||
                              0
                          )
                      )
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          crop,
                          index
                        ) => {

                          const percentage =
                            bestCropYield >
                            0
                              ? Math.min(
                                  100,
                                  Math.round(
                                    (Number(
                                      crop.yield ||
                                        0
                                    ) /
                                      bestCropYield) *
                                      100
                                  )
                                )
                              : 0;

                          return (
                            <div
                              key={`${crop.crop}-${index}`}
                              className="group"
                            >

                              <div className="flex items-center gap-4">

                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                                    index ===
                                    0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {index +
                                    1}
                                </div>

                                <div className="flex-1 min-w-0">

                                  <div className="flex justify-between mb-2">

                                    <span className="font-semibold text-gray-800 truncate">
                                      {
                                        crop.crop
                                      }
                                    </span>

                                    <span className="text-sm font-bold text-green-700">
                                      {Number(
                                        crop.yield ||
                                          0
                                      ).toFixed(
                                        2
                                      )}{" "}
                                      t/ha
                                    </span>

                                  </div>

                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                    <div
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700"
                                      style={{
                                        width: `${percentage}%`,
                                      }}
                                    />

                                  </div>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                  </div>

                ) : (

                  <EmptyChart message="Make predictions to compare crop productivity." />

                )}

              </div>

              {/* ENVIRONMENT */}

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Environmental Impact
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Factors influencing farm productivity
                    </p>

                  </div>

                  <Wind
                    className="text-blue-600"
                    size={25}
                  />

                </div>

                <div className="space-y-6">

                  {weatherData.length >
                  0 ? (

                    weatherData.map(
                      (
                        item
                      ) => {

                        const value =
                          Math.max(
                            0,
                            Math.min(
                              100,
                              Number(
                                item.impact ||
                                  0
                              )
                            )
                          );

                        return (
                          <div
                            key={
                              item.factor
                            }
                          >

                            <div className="flex justify-between mb-2">

                              <div className="flex items-center gap-2">

                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">

                                  <CloudRain
                                    size={
                                      16
                                    }
                                    className="text-blue-600"
                                  />

                                </div>

                                <span className="font-semibold text-gray-700">
                                  {
                                    item.factor
                                  }
                                </span>

                              </div>

                              <span className="font-bold text-green-700">
                                {value}%
                              </span>

                            </div>

                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700"
                                style={{
                                  width: `${value}%`,
                                }}
                              />

                            </div>

                          </div>
                        );
                      }
                    )

                  ) : (

                    <EmptyChart message="Environmental data is not available." />

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

      {activeTab ===
        "environment" && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7 mb-20">

          <div className="grid md:grid-cols-2 gap-6">

            <EnvironmentCard
              icon={
                <CloudRain
                  className="text-blue-600"
                  size={23}
                />
              }
              title="Rainfall Analysis"
              subtitle="Rainfall influence on productivity"
              value={getWeatherImpact(
                "Rainfall"
              )}
              bg="bg-blue-50"
              text="text-blue-800"
            />

            <EnvironmentCard
              icon={
                <Thermometer
                  className="text-orange-600"
                  size={23}
                />
              }
              title="Temperature Analysis"
              subtitle="Temperature influence on productivity"
              value={getWeatherImpact(
                "Temperature"
              )}
              bg="bg-orange-50"
              text="text-orange-800"
            />

            <EnvironmentCard
              icon={
                <Droplets
                  className="text-cyan-600"
                  size={23}
                />
              }
              title="Humidity Analysis"
              subtitle="Humidity influence on productivity"
              value={getWeatherImpact(
                "Humidity"
              )}
              bg="bg-cyan-50"
              text="text-cyan-800"
            />

            <EnvironmentCard
              icon={
                <FlaskConical
                  className="text-yellow-700"
                  size={23}
                />
              }
              title="Soil Moisture"
              subtitle="Estimated soil moisture influence"
              value={getWeatherImpact(
                "Soil Moisture"
              )}
              bg="bg-yellow-50"
              text="text-yellow-800"
            />

          </div>

          {/* ENVIRONMENT SUMMARY */}

          <div className="mt-6 bg-gradient-to-r from-blue-900 to-cyan-700 rounded-3xl p-8 text-white">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">

                <CloudRain
                  size={25}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Environmental Summary
                </h2>

                <p className="text-blue-100 text-sm">
                  Understanding the conditions affecting
                  your farm
                </p>

              </div>

            </div>

            <div className="grid sm:grid-cols-3 gap-5 mt-7">

              <SummaryMetric
                title="Average Influence"
                value={`${weatherAverage}%`}
              />

              <SummaryMetric
                title="Strongest Factor"
                value={
                  weatherData.length
                    ? weatherData.reduce(
                        (
                          best,
                          item
                        ) =>
                          Number(
                            item.impact ||
                              0
                          ) >
                          Number(
                            best.impact ||
                              0
                          )
                            ? item
                            : best,
                        weatherData[0]
                      ).factor
                    : "N/A"
                }
              />

              <SummaryMetric
                title="Factors Tracked"
                value={
                  weatherData.length
                }
              />

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          PRODUCTIVITY
      ===================================================== */}

      {activeTab ===
        "productivity" && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7 mb-20">

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">

                  <Target
                    className="text-green-700"
                    size={25}
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Crop Intelligence
                  </h2>

                  <p className="text-gray-500">
                    AI-based crop productivity analysis
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">

                <CircleGauge
                  size={18}
                  className="text-green-700"
                />

                <span className="font-semibold text-green-700">
                  {productivityScore}%
                  Productivity
                </span>

              </div>

            </div>

            {cropData.length >
            0 ? (

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {cropData
                  .slice(0, 6)
                  .map(
                    (
                      crop,
                      index
                    ) => {

                      const score =
                        bestCropYield >
                        0
                          ? Math.round(
                              (Number(
                                crop.yield ||
                                  0
                              ) /
                                bestCropYield) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={`${crop.crop}-${index}`}
                          className="group border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50/30"
                        >

                          <div className="flex justify-between">

                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">

                              <Sprout
                                className="text-green-700"
                                size={25}
                              />

                            </div>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold h-fit">
                              #{index +
                                1}
                            </span>

                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mt-5">
                            {
                              crop.crop
                            }
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Predicted average yield
                          </p>

                          <div className="flex items-end gap-2 mt-5">

                            <span className="text-3xl font-bold text-green-700">
                              {Number(
                                crop.yield ||
                                  0
                              ).toFixed(
                                2
                              )}
                            </span>

                            <span className="text-sm text-gray-500 mb-1">
                              t/ha
                            </span>

                          </div>

                          <div className="mt-5">

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

                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    score
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            ) : (

              <EmptyChart message="Make some yield predictions to generate crop productivity analytics." />

            )}

            {/* PRODUCTIVITY METRICS */}

            <div className="grid md:grid-cols-3 gap-5 mt-8">

              <ProductivityMetric
                icon={
                  TrendingUp
                }
                title="Productivity Score"
                value={`${productivityScore}%`}
                description="Current calculated score"
              />

              <ProductivityMetric
                icon={
                  Droplets
                }
                title="Water Impact"
                value={`${getWeatherImpact(
                  "Rainfall"
                )}%`}
                description="Rainfall influence score"
              />

              <ProductivityMetric
                icon={
                  Activity
                }
                title="Predictions"
                value={
                  predictionCount
                }
                description="Predictions in selected period"
              />

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          RISK
      ===================================================== */}

      {activeTab ===
        "risk" && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-7 mb-20">

          <div className="grid lg:grid-cols-3 gap-6">

            {/* OVERALL RISK */}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Overall Risk
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Farm Risk
                  </h2>

                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    overallRisk <=
                    30
                      ? "bg-green-50"
                      : overallRisk <=
                        60
                      ? "bg-yellow-50"
                      : "bg-red-50"
                  }`}
                >

                  <ShieldCheck
                    className={
                      overallRisk <=
                      30
                        ? "text-green-700"
                        : overallRisk <=
                          60
                        ? "text-yellow-700"
                        : "text-red-700"
                    }
                    size={25}
                  />

                </div>

              </div>

              <div className="py-9 flex justify-center">

                <div className="relative w-48 h-48">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[
                        {
                          value:
                            overallRisk,
                        },
                      ]}
                      startAngle={
                        90
                      }
                      endAngle={
                        -270
                      }
                    >

                      <PolarAngleAxis
                        type="number"
                        domain={[
                          0,
                          100,
                        ]}
                        tick={false}
                      />

                      <RadialBar
                        dataKey="value"
                        cornerRadius={
                          20
                        }
                        fill={
                          overallRisk <=
                          30
                            ? "#16a34a"
                            : overallRisk <=
                              60
                            ? "#ca8a04"
                            : "#dc2626"
                        }
                        background
                      />

                    </RadialBarChart>

                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <span className="text-4xl font-bold">
                      {
                        overallRisk
                      }
                    </span>

                    <span className="text-xs text-gray-500">
                      / 100
                    </span>

                  </div>

                </div>

              </div>

              <div className="text-center">

                <span
                  className={`inline-flex px-4 py-2 rounded-full font-bold text-sm ${
                    overallRisk <=
                    30
                      ? "bg-green-100 text-green-700"
                      : overallRisk <=
                        60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {
                    risk.level ||
                    "UNKNOWN"
                  }{" "}
                  RISK
                </span>

              </div>

            </div>

            {/* RISK BREAKDOWN */}

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

              <h2 className="text-xl font-bold text-gray-900">
                Risk Assessment
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-7">
                Potential factors affecting productivity
              </p>

              <div className="grid sm:grid-cols-2 gap-4">

                <RiskCard
                  title="Weather Risk"
                  description="Rainfall and weather conditions"
                  value={
                    risk.weather
                  }
                  icon={
                    <CloudRain
                      className="text-blue-600"
                      size={22}
                    />
                  }
                />

                <RiskCard
                  title="Soil Risk"
                  description="Nutrient and pH conditions"
                  value={
                    risk.soil
                  }
                  icon={
                    <FlaskConical
                      className="text-yellow-700"
                      size={22}
                    />
                  }
                />

                <RiskCard
                  title="Yield Risk"
                  description="Probability of yield reduction"
                  value={
                    risk.yield
                  }
                  icon={
                    <TrendingDown
                      className="text-orange-600"
                      size={22}
                    />
                  }
                />

                <RiskCard
                  title="Pest Risk"
                  description="Estimated pest-related risk"
                  value={
                    risk.pest
                  }
                  icon={
                    <ShieldCheck
                      className="text-red-600"
                      size={22}
                    />
                  }
                />

              </div>

            </div>

          </div>

          {/* FORECAST */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mt-6">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <TrendingUp
                  className="text-blue-700"
                  size={25}
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

            <div className="h-[330px]">

              {yieldTrend.length >
              0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={
                      yieldTrend
                    }
                  >

                    <defs>

                      <linearGradient
                        id="forecastGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={
                            0.25
                          }
                        />

                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={
                            0
                          }
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={
                        false
                      }
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
                      fill="url(#forecastGradient)"
                      strokeWidth={
                        3
                      }
                    />

                  </AreaChart>

                </ResponsiveContainer>

              ) : (

                <EmptyChart message="No forecast history available yet." />

              )}

            </div>

          </div>

          {/* SEASONAL */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 mt-6">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">

                <CalendarDays
                  className="text-green-700"
                  size={24}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Seasonal Productivity
                </h2>

                <p className="text-sm text-gray-500">
                  Compare productivity across agricultural seasons
                </p>

              </div>

            </div>

            <div className="h-[300px]">

              {seasonalData.length >
              0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      seasonalData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={
                        false
                      }
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

                <EmptyChart message="No seasonal prediction data available." />

              )}

            </div>

          </div>

          {/* AI ADVICE */}

          <div className="relative overflow-hidden bg-gradient-to-br from-green-800 to-emerald-600 rounded-3xl shadow-lg p-7 mt-6 text-white">

            <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">

                  <Lightbulb
                    size={25}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    AI Optimization Advice
                  </h2>

                  <p className="text-green-100 text-sm">
                    Data-driven recommendations for your farm
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">

                {suggestions.length >
                0 ? (

                  suggestions
                    .slice(
                      0,
                      4
                    )
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={`${item.title}-${index}`}
                          className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition"
                        >

                          <div className="flex items-center justify-between">

                            <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold">
                              {index +
                                1}
                            </span>

                            <ChevronRight
                              size={
                                17
                              }
                              className="text-green-200"
                            />

                          </div>

                          <h3 className="font-bold mt-4">
                            {
                              item.title
                            }
                          </h3>

                          <p className="text-sm text-green-100 mt-2 leading-relaxed">
                            {
                              item.text
                            }
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

          </div>

        </section>
      )}

      <Footer />

    </div>
  );
}


// =========================================================
// KPI CARD
// =========================================================

function KpiCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  positive,
}) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-start justify-between">

        <div className="min-w-0">

          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <div className="flex items-baseline gap-2 mt-3">

            <h2 className="text-3xl font-bold text-gray-900 truncate">
              {value}
            </h2>

            {unit && (
              <span className="text-sm text-gray-500">
                {unit}
              </span>
            )}

          </div>

        </div>

        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition`}
        >

          <Icon
            size={22}
            className={iconColor}
          />

        </div>

      </div>

      <div className="flex items-center gap-2 mt-4">

        {positive ? (
          <ArrowUpRight
            size={15}
            className="text-green-600"
          />
        ) : (
          <ArrowDownRight
            size={15}
            className="text-yellow-600"
          />
        )}

        <span
          className={`text-sm font-medium ${
            positive
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {description}
        </span>

      </div>

    </div>
  );
}


// =========================================================
// CHART CARD
// =========================================================

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 ${className}`}
    >

      <div className="flex items-start justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>

        </div>

        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">

          <BarChart3
            size={18}
            className="text-green-700"
          />

        </div>

      </div>

      {children}

    </div>
  );
}


// =========================================================
// MINI METRIC
// =========================================================

function MiniMetric({
  label,
  value,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-lg font-bold text-gray-900 mt-1">
        {value}
      </p>

    </div>
  );
}


// =========================================================
// INSIGHT CARD
// =========================================================

function InsightCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-sm transition">

      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">

        <Icon
          size={20}
          className="text-green-700"
        />

      </div>

      <p className="text-sm text-gray-500 mt-4">
        {title}
      </p>

      <p className="text-xl font-bold text-gray-900 mt-1 truncate">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>

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
  const safeValue =
    Number(value || 0);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 hover:shadow-lg transition">

      <div className="flex items-center gap-3">

        <div
          className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
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

      <div className="py-8">

        <div className="flex items-end justify-between">

          <div>

            <p
              className={`text-5xl font-bold ${text}`}
            >
              {safeValue}%
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Environmental influence
            </p>

          </div>

          <div className="w-24 h-24">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={[
                    {
                      value:
                        safeValue,
                    },
                    {
                      value:
                        100 -
                        safeValue,
                    },
                  ]}
                  dataKey="value"
                  innerRadius={
                    27
                  }
                  outerRadius={
                    38
                  }
                  startAngle={
                    90
                  }
                  endAngle={
                    -270
                  }
                  paddingAngle={
                    0
                  }
                >

                  <Cell
                    fill="#16a34a"
                  />

                  <Cell
                    fill="#f3f4f6"
                  />

                </Pie>

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      <div
        className={`${bg} rounded-xl p-4`}
      >

        <p
          className={`text-sm ${text}`}
        >

          <strong>
            Analysis:
          </strong>{" "}

          The backend currently estimates this
          factor's influence on agricultural
          productivity.

        </p>

      </div>

    </div>
  );
}


// =========================================================
// PRODUCTIVITY METRIC
// =========================================================

function ProductivityMetric({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">

      <Icon
        className="text-green-700"
        size={24}
      />

      <h3 className="font-bold mt-3">
        {title}
      </h3>

      <p className="text-2xl font-bold text-green-700 mt-2">
        {value}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </div>
  );
}


// =========================================================
// RISK CARD
// =========================================================

function RiskCard({
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
    <div className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>

          <div>

            <h3 className="font-bold text-gray-900">
              {title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>

          </div>

        </div>

        <span
          className={`${badge} px-3 py-1.5 rounded-full text-xs font-bold`}
        >
          {level}
        </span>

      </div>

      <div className="mt-5">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-gray-500">
            Risk level
          </span>

          <span className="font-bold">
            {riskValue}/100
          </span>

        </div>

        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

          <div
            className={`h-full rounded-full ${
              level === "LOW"
                ? "bg-green-500"
                : level === "MODERATE"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  riskValue
                )
              )}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}


// =========================================================
// SUMMARY METRIC
// =========================================================

function SummaryMetric({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 border border-white/10">

      <p className="text-sm text-blue-100">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2 truncate">
        {value}
      </p>

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
    <div className="h-full min-h-[220px] flex items-center justify-center">

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
// MAP ICON
// =========================================================

function MapIcon() {
  return (
    <TreePine size={16} />
  );
}