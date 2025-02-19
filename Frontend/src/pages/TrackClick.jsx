import { useState } from "react";
import axios from "axios";

const TrackClick = () => {
  const [productId, setProductId] = useState("");
  const [deviceType, setDeviceType] = useState("desktop");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrackClick = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/clicks/track-click",
        {
          productId,
          deviceType,
          affiliateUrl,
        },
        { withCredentials: true }
      );
      // Redirect to affiliate URL
      window.location.href = response.data.affiliateUrl;
    } catch (error) {
      setError("Error tracking the click.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Track Affiliate Click</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Product ID</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="Enter product ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Affiliate URL</label>
        <input
          type="text"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="Enter affiliate URL"
        />
      </div>

      <button
        onClick={handleTrackClick}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Tracking..." : "Track Click"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default TrackClick;
