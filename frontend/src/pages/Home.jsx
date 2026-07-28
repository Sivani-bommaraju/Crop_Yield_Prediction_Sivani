import { Navigate } from "react-router-dom";
import {
  Leaf,
  User,
  Database,
  ShieldCheck,
  LogOut,
  Sprout,
} from "lucide-react";

export default function Home() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const storedUser = localStorage.getItem("user");

const user = storedUser
  ? JSON.parse(storedUser)
  : {
      full_name: "Guest",
      email: "",
      role: ""
    };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">

      {/* Navbar */}
      <nav className="bg-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <Leaf className="text-white" size={34} />
            <div>
              <h1 className="text-2xl font-bold text-white">
                YieldSense AI
              </h1>
              <p className="text-green-100 text-sm">
                Crop Yield Prediction Platform
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-white text-green-700 px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-100"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </nav>

      {/* Welcome */}

      <div className="max-w-7xl mx-auto px-8 mt-10">

        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {user.full_name} 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Smart AI-powered agriculture management system.
        </p>

      </div>

      {/* Cards */}

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-8 mt-10">

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <User className="text-green-700 mb-4" size={40} />

          <h2 className="text-xl font-bold">
            User
          </h2>

          <p className="mt-4">
            <strong>Name:</strong> {user.full_name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <ShieldCheck
            className="text-green-700 mb-4"
            size={40}
          />

          <h2 className="text-xl font-bold">
            Authentication
          </h2>

          <ul className="mt-4 space-y-2">
            <li>✅ JWT Active</li>
            <li>✅ Login Successful</li>
            <li>✅ Protected Routes</li>
          </ul>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <Database
            className="text-green-700 mb-4"
            size={40}
          />

          <h2 className="text-xl font-bold">
            Backend Status
          </h2>

          <ul className="mt-4 space-y-2">
            <li>🟢 FastAPI Running</li>
            <li>🟢 MongoDB Connected</li>
            <li>🟢 APIs Working</li>
          </ul>

        </div>

      </div>

      {/* Upcoming */}

      <div className="max-w-7xl mx-auto px-8 mt-12">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-6">
            <Sprout className="text-green-700" />
            <h2 className="text-2xl font-bold">
              Upcoming Modules
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-green-50 rounded-xl p-5">
              🌾 Crop Information
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              🌦 Weather API
            </div>

            <div className="bg-yellow-50 rounded-xl p-5">
              🤖 AI Prediction
            </div>

            <div className="bg-purple-50 rounded-xl p-5">
              📊 Analytics Dashboard
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}