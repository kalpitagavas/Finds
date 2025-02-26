import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(""); // State for the profile image
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  // Retrieve user data (username, role, profile image) from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("role");
    const storedProfileImage = localStorage.getItem("profileImage");

    console.log("Stored Profile Image Path:", storedProfileImage); // Debugging: Check the path

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setUserRole(storedRole);

    if (storedProfileImage) {
      // Check if the image exists in the expected directory
      setUserProfileImage(`/uploads/${storedProfileImage}`); // Set the profile image path correctly
    } else {
      // Fallback if no image is found
      setUserProfileImage("/images/default-profile.png"); // Ensure you have a default image
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
    navigate("/"); // Redirect to the home page after logout
  };

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={
              darkMode
                ? "../src/assets/dark-logo.png"
                : "../src/assets/light-logo.png"
            }
            className="h-10 w-20"
            alt="Logo"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            )}
          </svg>
        </button>

        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link
            to="/Dashboard"
            className="text-orange-900 hover:text-orange-600 font-semibold"
          >
            Home
          </Link>

          {/* Add "Deals" link here */}
          {/* <Link to="/deals" className="text-orange-900 hover:text-orange-600 font-semibold">Deals</Link> */}
        </div>

        {/* Profile and settings */}
        <div className="relative flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            {/* Profile image or fallback */}
            {userProfileImage ? (
              <img
                className="w-8 h-8 rounded-full border"
                src={userProfileImage}
                alt="User"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border bg-gray-300 flex items-center justify-center">
                <span className="text-white">?</span>
              </div>
            )}
            {username && (
              <span className="text-white font-medium hidden md:block">
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
              className="absolute right-0 mt-12 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2"
            >
              {userRole === "admin" && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Admin Dashboard
                </button>
              )}

              {/* Only show "Login" if the user is not logged in */}
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

          {/* Add "Deals" link in mobile menu */}
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

          {/* Only show "Login" if the user is not logged in */}
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
