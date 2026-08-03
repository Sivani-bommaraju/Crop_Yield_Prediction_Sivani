import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AgriculturalOfficerDashboard from "./pages/AgriculturalOfficerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/officer" element={<AgriculturalOfficerDashboard />} />
        <Route path="/home" element={<ProtectedRoute allowedRoles={["farmer"]}><Home /></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/officer" element={<ProtectedRoute allowedRoles={["agricultural_officer"]}><AgriculturalOfficerDashboard /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;