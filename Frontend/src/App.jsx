import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"
import Navbar from "./pages/Navbar";
// import Home from "./pages/Home";

export default function App() {
  return (
    <>
      {/* ToastContainer must be here to work globally */}
      <ToastContainer position="center" autoClose={500} />

      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </>
  );
}
