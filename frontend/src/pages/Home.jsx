// import {
//   Link,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import FeatureCard from "../components/FeatureCard";
// import FarmerProfileCard from "../components/FarmerProfileCard";
// import WeatherCard from "../components/WeatherCard";
// import AIInsights from "../components/AIInsights";
// import PredictionSummary from "../components/PredictionSummary";
// import CropAnalytics from "../components/CropAnalytics";
// import RecentActivity from "../components/RecentActivity";
// import Footer from "../components/Footer";

// import { getFarmerProfile } from "../services/farmerService";

// import {
//   Wheat,
//   CloudSun,
//   BrainCircuit,
//   ScanSearch,
// } from "lucide-react";

// export default function Home() {

//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/" />;
//   }

//   const user = JSON.parse(localStorage.getItem("user")) || {
//     full_name: "Farmer",
//     role: "farmer",
//   };

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasProfile, setHasProfile] = useState(true);
// useEffect(() => {

//     const fetchProfile = async () => {

//         try {

//             const profile = await getFarmerProfile();

//             setProfile(profile);

//         } catch (err) {

//             if (err.response?.status === 404) {
//                 navigate("/complete-profile");
//                 return;
//             }

//             console.log(err);
//         }

//     };

//     fetchProfile();

// }, [navigate]);

//   const logout = () => {

//     localStorage.clear();

//     window.location.href = "/";

//   };

//   if (loading) {

//     return (

//       <div className="min-h-screen flex items-center justify-center bg-green-50">

//         <div className="text-center">

//           <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto"></div>

//           <p className="mt-6 text-xl font-semibold text-green-700">
//             Loading Dashboard...
//           </p>

//         </div>

//       </div>

//     );

//   }

//   // NEW USER
//   if (!hasProfile) {

//     return <Navigate to="/complete-profile" />;

//   }

//   return (

//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

//       <Navbar
//         user={user}
//         logout={logout}
//       />

//       <Hero user={user} />

//       {/* Profile + Weather */}

//       <section className="max-w-7xl mx-auto px-8 mt-14">

//         <div className="grid lg:grid-cols-2 gap-8">

//           <FarmerProfileCard
//             user={user}
//             profile={profile}
//           />

//           <WeatherCard profile={profile} />

//         </div>

//       </section>

//       {/* AI */}

//       <section className="max-w-7xl mx-auto px-8 mt-14">

//         <div className="mb-10">

//           <h2 className="text-3xl font-bold text-gray-800">
//             AI Services
//           </h2>

//           <p className="text-gray-500 mt-2">
//             Intelligent tools powered by Machine Learning.
//           </p>

//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">

//           <div className="lg:col-span-2">
//             <AIInsights />
//           </div>

//           <PredictionSummary />

//         </div>

//       </section>

//       {/* Analytics */}

//       <section className="max-w-7xl mx-auto px-8 mt-14">

//         <CropAnalytics />

//       </section>

//       {/* Recent Activity */}

//       <section className="max-w-7xl mx-auto px-8 mt-14">

//         <RecentActivity />

//       </section>

//       {/* Features */}

//       <section className="max-w-7xl mx-auto px-8 mt-14 mb-20">

//         <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

//           <FeatureCard
//             icon={<Wheat size={30} />}
//             title="Crop Recommendation"
//             description="Suggests the best crops based on soil, irrigation and regional conditions."
//             color="bg-green-600"
//             button="Explore"
//           />

//           <FeatureCard
//             icon={<BrainCircuit size={30} />}
//             title="Yield Prediction"
//             description="Predict crop yield using historical agricultural and environmental data."
//             color="bg-blue-600"
//             button="Predict"
//           />

//           <FeatureCard
//             icon={<CloudSun size={30} />}
//             title="Weather Intelligence"
//             description="Monitor weather conditions that influence crop growth and productivity."
//             color="bg-yellow-500"
//             button="View Weather"
//           />

//           <FeatureCard
//             icon={<ScanSearch size={30} />}
//             title="Disease Detection"
//             description="Upload crop images and identify plant diseases using Deep Learning."
//             color="bg-red-500"
//             button="Detect"
//           />

//         </div>

//       </section>

//       <Footer />

//     </div>

//   );

// }
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import FarmerProfileCard from "../components/FarmerProfileCard";
import WeatherCard from "../components/WeatherCard";
import AIInsights from "../components/AIInsights";
import PredictionSummary from "../components/PredictionSummary";
import CropAnalytics from "../components/CropAnalytics";
import RecentActivity from "../components/RecentActivity";
import Footer from "../components/Footer";

import { getFarmerProfile } from "../services/farmerService";

import {
  Wheat,
  CloudSun,
  BrainCircuit,
  ScanSearch,
} from "lucide-react";

export default function Home() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(localStorage.getItem("user")) || {
    full_name: "Farmer",
    role: "farmer",
  };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadProfile() {

      try {

        const data = await getFarmerProfile();

        if (!data) {
          navigate("/complete-profile");
          return;
        }

        console.log("PROFILE FROM API:", data);

        setProfile(data);

      } catch (err) {

        console.log(err);

        if (err.response?.status === 404) {
          navigate("/complete-profile");
          return;
        }

        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
          return;
        }

      } finally {
        setLoading(false);
      }

    }

    loadProfile();

  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-5 text-lg font-semibold text-green-700">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-lime-100">

      <Navbar user={user} logout={logout} />

      <Hero user={user} />

      <section className="max-w-7xl mx-auto px-8 mt-14">
        <div className="grid lg:grid-cols-2 gap-8">

          <FarmerProfileCard
            user={user}
            profile={profile}
          />

          <WeatherCard
            profile={profile}
          />

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mt-14">

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            AI Services
          </h2>

          <p className="text-gray-500 mt-2">
            Intelligent tools powered by Machine Learning.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <AIInsights />
          </div>

          <PredictionSummary />

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-8 mt-14">
        <CropAnalytics />
      </section>

      <section className="max-w-7xl mx-auto px-8 mt-14">
        <RecentActivity />
      </section>

      <section className="max-w-7xl mx-auto px-8 mt-14 mb-20">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

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