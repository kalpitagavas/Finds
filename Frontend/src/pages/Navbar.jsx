import { useState, useEffect } from 'react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <a href="#" className="flex items-center space-x-3">
          <img
            src={darkMode ? "../src/assets/dark-logo.png" : "../src/assets/light-logo.png"}
            className="h-10 w-20"
            alt="Logo"
          />
        </a>

        {/* Navigation Links */}
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="#" className="block py-2 px-3 text-white bg-orange-900 rounded-sm md:bg-transparent md:text-orange-900 md:p-0 md:dark:text-orange-900">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-900 md:p-0 dark:text-white md:dark:hover:text-orange-900">
                About
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-900 md:p-0 dark:text-white md:dark:hover:text-orange-900">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-900 md:p-0 dark:text-white md:dark:hover:text-orange-900">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-900 md:p-0 dark:text-white md:dark:hover:text-orange-900">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Dark Mode Toggle & Profile Section */}
        <div className="flex items-center md:order-2 space-x-3">
          {/* Dark Mode Toggle Button */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4.22 2.47a1 1 0 010 1.42l-.71.7a1 1 0 11-1.42-1.4l.7-.71a1 1 0 011.43-.01zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-8 8a1 1 0 011-1v-1a1 1 0 10-2 0v1a1 1 0 011 1zm-5.64-2.64a1 1 0 00-.7-1.7 1 1 0 00-1.41 1.41l.71.7a1 1 0 001.4-1.41zM4 10a1 1 0 00-1-1H2a1 1 0 000 2h1a1 1 0 001-1zm2.47-5.64a1 1 0 011.42 0l.7.71a1 1 0 11-1.41 1.42l-.71-.7a1 1 0 010-1.42zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 1010.586 10.586z" clipRule="evenodd"></path>
              </svg>
            )}
          </button>

          {/* Profile Section */}
          <button className="flex text-sm bg-orange-900 rounded-full focus:ring-4 focus:ring-orange-900 dark:focus:ring-orange-900">
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" src="../src/assets/images.png" alt="User Profile" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
