import { useState, useEffect } from "react";
import axios from "axios";

const VlogCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false); // To track the click process
  const [successMessage, setSuccessMessage] = useState(""); // Message to show after successful tracking

  const categories = ["All", "Kitchen Finds", "Home Decor", "Aesthetic Look"];

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/allproducts"
        );
        const activeProducts = response.data.filter(
          (product) => product.status === "active"
        );
        setProducts(activeProducts);
      } catch (err) {
        setError("Error fetching products");
      }
    };
    fetchActiveProducts();
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleBuyButtonClick = async (product) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to track the click.");
      return;
    }

    // Decode the JWT token to extract userId
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;

    const deviceType = "desktop";
    const source = "direct";
    const affiliateUrl = product.buyLink;
    const referrer = document.referrer || "";

    const requestData = { userId, deviceType, source, affiliateUrl, referrer };

    try {
      setTracking(true);
      setSuccessMessage("");

      // Send POST request to track the affiliate click
      const response = await axios.post(
        `http://localhost:8080/api/affiliate/click/${product._id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message including the updated click count
      setSuccessMessage(
        `Click successfully tracked! Total clicks: ${response.data.count}`
      );

      // Wait a bit before redirecting to the affiliate URL
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-semibold text-center text-gray-900 mb-10 dark:text-white">
        Featured Products
      </h2>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-orange-900 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick(product)}
            >
              <img
                src={`http://localhost:8080/${product.images[0]}`}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-2xl font-medium text-gray-800 hover:text-orange-900 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  {product.description}
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-4">
                  Rs.{product.price}
                </p>

                {/* Affiliate Link Button */}
                {product.buyLink && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleBuyButtonClick(product);
                    }}
                    className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No active products available.
          </p>
        )}
      </div>

      {/* Status Messages */}
      {tracking && (
        <div className="tracking-message">Tracking your click...</div>
      )}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VlogCard;
