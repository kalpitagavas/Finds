import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./pages/DashBoard";
import Footer from "./pages/Footer";
import AdminDashboard from "./pages/AdminDashboard";
// import Home from "./pages/Home";

export default function App() {
  return (
    <>
      {/* ToastContainer must be here to work globally */}
      <ToastContainer position="center" autoClose={500} />
      
     

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
      <Footer/>
    </>
  );
}
