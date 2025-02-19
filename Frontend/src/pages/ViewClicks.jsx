// src/components/ViewClicks.js
import  { useEffect, useState } from "react";
import axios from "axios";

const ViewClicks = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClicks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("/api/clicks/clicks", { withCredentials: true });
        setClicks(response.data); // Assuming API returns an array of clicks
      } catch (error) {
        setError("Error fetching clicks.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClicks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">All Affiliate Clicks</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Product ID</th>
              <th className="px-4 py-2 border-b text-left">User ID</th>
              <th className="px-4 py-2 border-b text-left">Device Type</th>
              <th className="px-4 py-2 border-b text-left">Click Time</th>
              <th className="px-4 py-2 border-b text-left">Affiliate URL</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click._id}>
                <td className="px-4 py-2 border-b">{click.product}</td>
                <td className="px-4 py-2 border-b">{click.user}</td>
                <td className="px-4 py-2 border-b">{click.deviceType}</td>
                <td className="px-4 py-2 border-b">{new Date(click.clickedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  <a
                    href={click.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {click.affiliateUrl}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewClicks;
