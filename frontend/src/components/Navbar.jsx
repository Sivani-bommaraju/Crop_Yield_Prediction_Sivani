
import {
  Leaf,
  Bell,
  LogOut,
  UserCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Navbar({ user, logout }) {

  const navigate = useNavigate();

  const currentUser =
    user || JSON.parse(localStorage.getItem("user") || "{}");


  // ==========================================
  // LOGO CLICK
  // ==========================================

  const handleLogoClick = () => {

    if (currentUser?.role === "farmer") {
      navigate("/home");
    }

    else if (
      currentUser?.role === "agricultural_officer"
    ) {
      navigate("/officer");
    }

    else if (currentUser?.role === "admin") {
      navigate("/admin");
    }

    else {
      navigate("/");
    }

  };


  // ==========================================
  // NOTIFICATION CLICK
  // ==========================================

  const handleNotificationClick = () => {

    if (currentUser?.role === "farmer") {

      navigate("/home#advisories");

      setTimeout(() => {

        const section =
          document.getElementById("advisories");

        if (section) {

          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

        }

      }, 150);

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    if (logout) {
      logout();
    }

    navigate("/");

  };


  return (

    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-green-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">


        {/* =====================================
            LOGO
        ===================================== */}

        <button
          onClick={handleLogoClick}
          className="flex items-center gap-4 text-left group cursor-pointer"
        >

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">

            <Leaf
              className="text-white"
              size={30}
            />

          </div>


          <div>

            <h1 className="text-2xl font-bold text-gray-800">
              YieldSense AI
            </h1>

            <p className="text-sm text-gray-500">
              Precision Agriculture Platform
            </p>

          </div>

        </button>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="flex items-center gap-5">


          {/* =================================
              NOTIFICATIONS
          ================================= */}

          <button
            onClick={handleNotificationClick}
            className="relative hover:bg-green-50 p-3 rounded-xl transition cursor-pointer"
            title="Officer Recommendations"
          >

            <Bell
              size={22}
              className="text-gray-600"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

          </button>


          {/* =================================
              USER
          ================================= */}

          <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-4 py-2">

            <UserCircle2
              size={40}
              className="text-green-700"
            />

            <div>

              <h3 className="font-semibold text-gray-800">
                {currentUser?.full_name || "Guest"}
              </h3>

              <p className="text-sm text-gray-500 capitalize">
                {currentUser?.role || "User"}
              </p>

            </div>

          </div>


          {/* =================================
              LOGOUT
          ================================= */}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </div>

    </nav>

  );

}