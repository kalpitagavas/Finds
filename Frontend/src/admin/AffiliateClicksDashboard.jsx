import { useState, useEffect } from "react";
import axios from "axios";

const AffiliateClicksDashboard = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Set the body background color based on darkMode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900");
      document.body.classList.remove("bg-white");
    } else {
      document.body.classList.add("bg-white");
      document.body.classList.remove("bg-gray-900");
    }
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
    // Using a static userId; replace with dynamic value when available.
    const userId = "sampleUserId";
    const deviceType = "desktop";
    const source = "direct";

    setTracking(true);
    setSuccessMessage("");
    try {
      await axios.post(
        `http://localhost:8080/api/affiliate/click/${productId}`,
        {
          userId,
          deviceType,
          source,
        }
      );
      console.log("Affiliate click tracked for product:", productId);
      setSuccessMessage("Click successfully tracked! Redirecting...");
      setTimeout(() => {
        window.location.href = affiliateUrl;
      }, 2000);
    } catch (error) {
      console.error("Error tracking affiliate click:", error);
      setError("Error tracking affiliate click. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-600 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gradient-to-r from-red-50 to-red-100">
        <p className="text-red-500 text-2xl">{error}</p>
        <button
          onClick={fetchAffiliateClicks}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-xl rounded-lg">
      {/* Header with Back and Toggle Mode buttons */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md transition"
          >
            Back
          </button>
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Affiliate Clicks Dashboard
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          Toggle Mode
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
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Device Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Affiliate URL
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Clicked At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clicks.map((click) => (
                <tr
                  key={click._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                      className="text-blue-600 hover:underline"
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

      {/* Status Messages */}
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
