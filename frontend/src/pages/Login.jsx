import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { loginUser } from "../services/authService";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { googleLoginBackend } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
const googleLogin = async () => {

  try {

    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const firebaseUser = result.user;

    const idToken = await firebaseUser.getIdToken();

    const res = await googleLoginBackend(idToken);

    localStorage.setItem(
      "token",
      res.access_token
    );

localStorage.setItem("token", res.access_token);

localStorage.setItem(
  "user",
  JSON.stringify(res.user)
);

localStorage.setItem(
  "role",
  res.user.role
);

switch (res.user.role) {
  case "admin":
    navigate("/admin");
    break;

  case "agricultural_officer":
    navigate("/officer");
    break;

  default:
    navigate("/home");
}

  } catch (err) {

    console.log(err);

  }

};

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    const res = await loginUser(form);

    

localStorage.setItem("token", res.access_token);

localStorage.setItem(
  "user",
  JSON.stringify(res.user)
);

localStorage.setItem(
  "role",
  res.user.role
);

switch (res.user.role) {
  case "admin":
    navigate("/admin");
    break;

  case "agricultural_officer":
    navigate("/officer");
    break;

  default:
    navigate("/home");
}

  } catch (err) {
    console.log(err.response?.data);

    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      setMessage(detail[0].msg);
    } else {
      setMessage(detail || "Login Failed");
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
            Welcome Back
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>


<button
  type="button"
  onClick={googleLogin}
  className="w-full mt-4 border rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
>
  <FcGoogle size={24}/>
  Continue with Google
</button>

        </form>

        {message && (
          <p className="text-center mt-4 text-red-600">
            {message}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-green-700 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}