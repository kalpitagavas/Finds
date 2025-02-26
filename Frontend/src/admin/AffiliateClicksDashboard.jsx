import { useState, useEffect } from "react";
import axios from "axios";

const AffiliateClicksDashboard = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("bg-gray-900", darkMode);
    document.body.classList.toggle("bg-white", !darkMode);
  }, [darkMode]);

  const fetchAffiliateClicks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/affiliate-clicks"
      );
      setClicks(response.data);
    } catch (err) {
      setError(`Error fetching affiliate clicks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateClicks();
  }, []);

  const handleAffiliateClick = async (productId, affiliateUrl) => {
    const userId = "sampleUserId";
    const deviceType = "desktop";
    const source = "direct";

    setTracking(true);
    setSuccessMessage("");
    try {
      await axios.post(
        `http://localhost:8080/api/affiliate/click/${productId}`,
        { userId, deviceType, source }
      );
      setSuccessMessage("Click successfully tracked! Redirecting...");
      setTimeout(() => {
        window.location.href = affiliateUrl;
      }, 2000);
    } catch (error) {
      setError("Error tracking affiliate click. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-purple-300 text-gray-700 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-red-50">
        <p className="text-red-600 text-2xl">{error}</p>
        <button
          onClick={fetchAffiliateClicks}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-md">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
          >
            Back
          </button>
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Affiliate Clicks Dashboard
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {clicks.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-2xl">
          No affiliate clicks recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                {[
                  "User",
                  "Product",
                  "Device Type",
                  "Affiliate URL",
                  "Referrer",
                  "Source",
                  "Clicked At",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clicks.map((click) => (
                <tr
                  key={click._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.user?.username || "Unknown User"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.product?.name || "Unknown Product"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.deviceType || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <a
                      href={click.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAffiliateClick(
                          click.product._id,
                          click.affiliateUrl
                        );
                      }}
                    >
                      {click.affiliateUrl || "No URL"}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.referrer || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.source || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {click.clickedAt
                      ? new Date(click.clickedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tracking && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-md shadow animate-pulse">
          Tracking your click...
        </div>
      )}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md shadow animate-bounce">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AffiliateClicksDashboard;
