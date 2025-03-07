import CarouselComponent from "../components/CarouselComponent";
import VlogCard from "../components/VlogCard";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
    return (
    <div className="bg-white dark:bg-gray-900 m-h-screen text-gray-900 dark:text-white">
       <Navbar/> {/* Removed the extra '<' */}
      <CarouselComponent />
     <VlogCard/>
     <Footer/>
    </div>
  );
};

export default Dashboard;
