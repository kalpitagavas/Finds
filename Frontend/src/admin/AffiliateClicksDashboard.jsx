import { useState, useEffect } from 'react';
import axios from 'axios';

const AffiliateClicksDashboard = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliateClicks = async () => {
      try {
        // Use relative path (the proxy setup in React's package.json will forward this to the backend)
        const response = await axios.get('http://localhost:8080/api/admin/affiliate-clicks');  // Make sure to use relative path
        setClicks(response.data);
      } catch (err) {
        setError('Error fetching affiliate clicks',err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateClicks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">Affiliate Clicks Dashboard</h1>
      {clicks.length === 0 ? (
        <p>No affiliate clicks recorded yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Product</th>
              <th>Device Type</th>
              <th>Affiliate URL</th>
              <th>Referrer</th>
              <th>Source</th>
              <th>Clicked At</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click._id}>
                <td>{click.user.username}</td>
                <td>{click.product.name}</td>
                <td>{click.deviceType}</td>
                <td>
                  <a href={click.affiliateUrl} target="_blank" rel="noopener noreferrer">
                    {click.affiliateUrl}
                  </a>
                </td>
                <td>{click.referrer || 'N/A'}</td>
                <td>{click.source}</td>
                <td>{new Date(click.clickedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AffiliateClicksDashboard;
