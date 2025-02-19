import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./pages/DashBoard";

import AdminDashboard from "./pages/AdminDashboard";
import TrackClick from "./pages/TrackClick";
import ViewClicks from "./pages/ViewClicks";
import Deals from "./pages/Deals";


export default function App() {
  return (
    <>
      {/* ToastContainer must be here to work globally */}
      <ToastContainer position="center" autoClose={500} />

      <Routes>
        <Route path="/" element={<Login />} />
      
        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/track-click" element={<TrackClick />} />
        <Route path="/view-clicks" element={<ViewClicks />} />
        <Route path="/deals" element={<Deals />} />
      </Routes>


  
    </>
  );
}
