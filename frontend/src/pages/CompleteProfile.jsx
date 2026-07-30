import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, MapPin, Tractor, Droplets, Sprout } from "lucide-react";
import { createFarmerProfile } from "../services/farmerService";

export default function CompleteProfile() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    state: "",
    district: "",
    village: "",
    land_size: "",
    soil_type: "",
    irrigation: "",
    preferred_crops: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await createFarmerProfile({
          ...form,
          land_size: Number(form.land_size),
      });

      navigate("/home");

    } catch (err) {

      console.log(err.response.data);
console.log(err.response.data.detail);

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-100 flex items-center justify-center px-6 py-10">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-10">

        <div className="text-center mb-10">

          <Leaf
            className="mx-auto text-green-700"
            size={50}
          />

          <h1 className="text-4xl font-bold mt-4">
            Complete Your Farmer Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Tell us about your farm to unlock AI-powered recommendations.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            name="district"
            placeholder="District"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            name="village"
            placeholder="Village"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            type="number"
            name="land_size"
            placeholder="Land Size (Acres)"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            name="soil_type"
            placeholder="Soil Type"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            name="irrigation"
            placeholder="Irrigation"
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            name="preferred_crops"
            placeholder="Rice, Cotton, Wheat"
            className="md:col-span-2 border rounded-xl p-3"
            onChange={handleChange}
            required
          />

          <button
            disabled={loading}
            className="md:col-span-2 bg-green-700 hover:bg-green-800 text-white rounded-xl py-4 text-lg font-semibold"
          >

            {loading
              ? "Creating Profile..."
              : "Create Profile"}

          </button>

        </form>

      </div>

    </div>

  );

}