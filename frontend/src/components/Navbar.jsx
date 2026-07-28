import {
  Leaf,
  Bell,
  LogOut,
  UserCircle2,
} from "lucide-react";

export default function Navbar({ user, logout }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-green-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center shadow-lg">

            <Leaf className="text-white" size={30} />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-gray-800">
              YieldSense AI
            </h1>

            <p className="text-sm text-gray-500">
              Precision Agriculture Platform
            </p>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-5">

          {/* Notification */}

          <button className="relative hover:bg-green-50 p-3 rounded-xl transition">

            <Bell
              size={22}
              className="text-gray-600"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-4 py-2">

            <UserCircle2
              size={40}
              className="text-green-700"
            />

            <div>

              <h3 className="font-semibold text-gray-800">
                {user.full_name}
              </h3>

              <p className="text-sm text-gray-500 capitalize">
                {user.role}
              </p>

            </div>

          </div>

          {/* Logout */}

          <button
            onClick={logout}
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