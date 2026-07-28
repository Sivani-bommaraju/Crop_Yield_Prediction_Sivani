import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await registerUser(form);

      setMessage("Registration Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      if (Array.isArray(err.response?.data?.detail)) {
  setMessage(err.response.data.detail[0].msg);
} else {
  setMessage(
    err.response?.data?.detail || "Registration Failed"
  );
}
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        <div className="flex flex-col items-center">

          <Leaf className="text-green-700" size={50} />

          <h1 className="text-3xl font-bold mt-3">
            YieldSense AI
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-semibold transition"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-green-700">
            {message}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">

          Already have an account?

          <Link
            to="/"
            className="text-green-700 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}