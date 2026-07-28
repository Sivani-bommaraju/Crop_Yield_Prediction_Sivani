import {
  User,
  MapPin,
  Tractor,
  Droplets,
  Sprout,
  Wheat,
  Pencil,
} from "lucide-react";

export default function FarmerProfileCard({ user }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 h-full hover:shadow-2xl transition">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="bg-green-100 p-3 rounded-2xl">
            <User className="text-green-700" size={28} />
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Farmer Profile
            </h2>

            <p className="text-gray-500">
              Personal Information
            </p>

          </div>

        </div>

        <button className="text-green-700 hover:text-green-900">
          <Pencil size={20} />
        </button>

      </div>

      <div className="mt-8 flex items-center gap-4">

        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">

          {user.full_name?.charAt(0)}

        </div>

        <div>

          <h3 className="text-2xl font-bold">
            {user.full_name}
          </h3>

          <p className="capitalize text-green-700 font-medium">
            {user.role}
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex items-center gap-3">
          <MapPin className="text-green-700" />
          <span>Amaravati, Andhra Pradesh</span>
        </div>

        <div className="flex items-center gap-3">
          <Tractor className="text-green-700" />
          <span>5.5 Acres</span>
        </div>

        <div className="flex items-center gap-3">
          <Sprout className="text-green-700" />
          <span>Black Soil</span>
        </div>

        <div className="flex items-center gap-3">
          <Droplets className="text-green-700" />
          <span>Drip Irrigation</span>
        </div>

        <div className="flex items-center gap-3">
          <Wheat className="text-green-700" />
          <span>Rice • Cotton</span>
        </div>

      </div>

    </div>
  );
}