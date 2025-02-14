import { useEffect, useState } from "react";


const Footer = () => {
    const [darkMode,setDarkMode]=useState(localStorage.getItem('theme'=='dark'));
 
 useEffect(()=>{
  if(darkMode){
    document.documentElement.classList.add("dark");
  }else{
    document.documentElement.classList.remove("dark");
  }
 },[darkMode])
    return (
        
    <footer className="bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} Your Company. All rights reseved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="/privacy-policy"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
