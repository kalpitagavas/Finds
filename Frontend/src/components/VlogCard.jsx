import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../pages/Modal"; // Import Modal component

const VlogCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Kitchen Finds", "Home Decor", "Aesthetic Look"];

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/allproducts");
        const activeProducts = response.data.filter((product) => product.status === "active");
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
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
              selectedCategory === category ? "bg-orange-900 text-white" : "bg-gray-200 text-gray-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            // Display the first available image or video
            const media = product.images.length > 0 ? (
              <img
                src={`http://localhost:8080/${product.images[0]}`}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            ) : product.videos.length > 0 ? (
              <video
                className="w-full h-64 object-cover rounded-t-lg"
                controls
                
              >
                <source src={`http://localhost:8080/${product.videos[0]}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null;

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(product)}
              >
                {media}

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-2xl font-medium text-gray-800 hover:text-orange-900 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">{product.description}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-4">Rs.{product.price}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No active products available.
          </p>
        )}
      </div>

      {/* Modal for product details */}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default VlogCard;
