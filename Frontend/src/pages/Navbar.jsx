import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Dark mode functionality
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Retrieve user data from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("role");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setUserRole(storedRole);

    if (storedProfileImage) {
      setUserProfileImage(`/uploads/${storedProfileImage}`);
    } else {
      setUserProfileImage("/images/default-profile.png");
    }
  }, []);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("status");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("lastLogin");
    localStorage.removeItem("profileImage");
    navigate("/");
  };

  const isLoggedIn = localStorage.getItem("token");

  // Trigger file input for profile image change
  const handleChangeProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Upload new profile image using field name "profilePhoto"
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      // Use the correct endpoint as defined in your backend (e.g., /api/users/upload-profile)
      const response = await axios.put("http://localhost:8080/api/users/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Expect the backend to return { filename: "newfilename.jpg" }
      const newFilename = response.data.user.profilePic.replace("/uploads/", "");
      localStorage.setItem("profileImage", newFilename);
      setUserProfileImage(`/uploads/${newFilename}`);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={darkMode ? "../src/assets/dark-logo.png" : "../src/assets/light-logo.png"}
            className="h-10 w-20"
            alt="Logo"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link to="/Dashboard" className="text-orange-900 hover:text-orange-600 font-semibold">
            Home
          </Link>
        </div>

        {/* Profile and settings */}
        <div className="relative flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            {userProfileImage ? (
              <img className="w-8 h-8 rounded-full border" src={userProfileImage} alt="User" />
            ) : (
              <div className="w-8 h-8 rounded-full border bg-gray-300 flex items-center justify-center">
                <span className="text-white">?</span>
              </div>
            )}
            {username && (
              <span className="text-orange-900 font-medium hidden md:block dark:text-white">
                {username}
              </span>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-12 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2"
            >
              {userRole === "admin" && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Admin Dashboard
                </button>
              )}

              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Login
                </button>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>

              {/* Change Profile Image */}
              <button
                onClick={handleChangeProfileClick}
                className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Change Profile Image
              </button>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 z-50 flex flex-col items-center space-y-4 p-4 shadow-md"
        >
          <Link
            to="/Dashboard"
            className="text-orange-900 hover:text-orange-600 font-semibold py-2 px-4 w-full text-center"
          >
            Home
          </Link>
          <Link
            to="/deals"
            className="text-orange-900 hover:text-orange-600 font-semibold py-2 px-4 w-full text-center"
          >
            Deals
          </Link>
          {userRole === "admin" && (
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 w-full text-center"
            >
              Admin Dashboard
            </button>
          )}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 w-full text-center"
            >
              Login
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 w-full text-center"
          >
            Logout
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
