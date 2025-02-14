import { useEffect, useState } from "react";
import axios from "axios";

const VlogCard = () => {
  const [vlogs, setVlogs] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Apply dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch vlogs from API on component mount
  useEffect(() => {
    const fetchVlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vlogs");
        setVlogs(response.data.vlogs);
        console.log("Fetched vlogs:", response.data.vlogs);
      } catch (error) {
        console.error("Error fetching vlogs:", error);
      }
    };
    fetchVlogs();
  }, []);

  // Open modal with selected product details and set the initial image index
  const openModal = (vlog, imageIndex) => {
    const productData = {
      images: vlog.productImages, // full array of images
      title: vlog.title,
      description: vlog.description,
      affiliateLinks: vlog.affiliateLinks,
    };
    setSelectedProduct(productData);
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  // Close modal and reset selected product and image index
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  // Carousel navigation functions
  const prevImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProduct.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedProduct.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-[-20px]">
      <h2 className="text-2xl font-bold mt-8 mb-4">Featured Products</h2>
      {/* Render one card per vlog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vlogs.map((vlog) => (
          <div key={vlog._id} className="bg-white p-4 shadow-md rounded-lg">
            {/* Use the first image for the card preview */}
            <div className="relative group">
              <img
                src={vlog.productImages[0]} // show only the first image as preview
                alt={`Product for ${vlog.title}`}
                className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay caption that opens the modal */}
              <div
                className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => openModal(vlog, 0)}
              >
                <div className="bg-orange-900 bg-opacity-70 dark:bg-gray-900 text-white py-1 px-3 rounded transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  View Product
                </div>
              </div>
            </div>
            {/* Product details */}
            <div className="mt-3">
              <h3 className="text-lg font-semibold">{vlog.title}</h3>
              <p className="text-sm text-gray-600">{vlog.description}</p>
              {vlog.affiliateLinks[0] && (
                <a
                  href={vlog.affiliateLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-blue-500 hover:underline dark:text-orange-900"
                >
                  Buy Now
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Carousel */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          {/* Modal content container */}
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-5xl mx-4 md:mx-auto flex flex-col md:flex-row shadow-xl">
            {/* Left side: Carousel for images */}
            <div className="md:w-1/2 relative overflow-hidden">
              <img
                src={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {selectedProduct.images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                    onClick={prevImage}
                  >
                    &#8592;
                  </button>
                  <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                    onClick={nextImage}
                  >
                    &#8594;
                  </button>
                </>
              )}
            </div>
            {/* Right side: Product info */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                {selectedProduct.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedProduct.description}
              </p>
              {selectedProduct.affiliateLinks &&
                selectedProduct.affiliateLinks[currentImageIndex] && (
                  <>
                    <a
                      href={selectedProduct.affiliateLinks[currentImageIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline dark:text-orange-400"
                    >
                      {selectedProduct.affiliateLinks[currentImageIndex].title ||
                        "Buy Now"}
                    </a>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Clicks:{" "}
                      {selectedProduct.affiliateLinks[currentImageIndex].clicks}
                    </p>
                  </>
                )}
            </div>
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VlogCard;
