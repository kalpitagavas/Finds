import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../pages/Modal"; // Import your Modal component

const VlogCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/allproducts");
        const activeProducts = response.data.filter(product => product.status === "active");
        setProducts(activeProducts);
        console.log("res",response)
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

  const handleBuyNowClick = (event) => {
    event.stopPropagation();
    // Handle the Buy Now button click logic here
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-semibold text-center text-gray-900 mb-10">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick(product)} // Attach click handler to the card
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
                <p className="text-gray-500 mt-2 text-sm">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-semibold text-gray-900">${product.price}</p>
                  <button
                    className="bg-orange-900 text-white px-4 py-2 rounded-lg hover:bg-orange-900 transition-colors"
                    onClick={handleBuyNowClick} // Attach click handler to the Buy Now button
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No active products available.</p>
        )}
      </div>
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default VlogCard;
