import { Navigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatCard from "../components/StatCard";
import FarmerProfileCard from "../components/FarmerProfileCard";
import WeatherCard from "../components/WeatherCard";
import Footer from "../components/Footer";
import AIInsights from "../components/AIInsights";
import PredictionSummary from "../components/PredictionSummary";
import RecentActivity from "../components/RecentActivity";

import {
  User,
  ShieldCheck,
  Database,
  Activity,
} from "lucide-react";

import {
  Wheat,
  CloudSun,
  BrainCircuit,
  ScanSearch,
} from "lucide-react";

export default function Home() {

  const token = localStorage.getItem("token");

  if (!token)
    return <Navigate to="/" />;

  const user = JSON.parse(localStorage.getItem("user")) || {
    full_name: "Farmer",
    role: "farmer",
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

      <Navbar
        user={user}
        logout={logout}
      />

      <Hero user={user} />

      <section className="max-w-7xl mx-auto px-8 mt-14">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h2 className="text-3xl font-bold text-gray-800">
        AI Services
      </h2>

      <p className="text-gray-500 mt-2">
        Intelligent tools powered by Machine Learning.
      </p>

    </div>

  </div>

  <section className="max-w-7xl mx-auto px-8 mt-14 mb-20">

  <div className="grid lg:grid-cols-2 gap-8">

    <FarmerProfileCard
      user={user}
    />

    <WeatherCard />

  </div>

</section>


<section className="max-w-7xl mx-auto px-8 mt-14">

  <div className="grid lg:grid-cols-3 gap-8">

    <div className="lg:col-span-2">
      <AIInsights />
    </div>

    <PredictionSummary />

  </div>

</section>

<section className="max-w-7xl mx-auto px-8 mt-10 mb-20">

  <RecentActivity />

</section>

  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">

    <FeatureCard
      icon={<Wheat size={30} />}
      title="Crop Recommendation"
      description="Suggests the best crops based on soil, irrigation and regional conditions."
      color="bg-green-600"
      button="Explore"
    />

    <FeatureCard
      icon={<BrainCircuit size={30} />}
      title="Yield Prediction"
      description="Predict crop yield using historical agricultural and environmental data."
      color="bg-blue-600"
      button="Predict"
    />

    <FeatureCard
      icon={<CloudSun size={30} />}
      title="Weather Intelligence"
      description="Monitor weather conditions that influence crop growth and productivity."
      color="bg-yellow-500"
      button="View Weather"
    />

    <FeatureCard
      icon={<ScanSearch size={30} />}
      title="Disease Detection"
      description="Upload crop images and identify plant diseases using Deep Learning."
      color="bg-red-500"
      button="Detect"
    />

  </div>

</section>

<Footer />

    </div>

  );

}