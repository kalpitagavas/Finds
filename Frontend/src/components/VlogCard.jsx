import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const VlogCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showReviewInput, setShowReviewInput] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/allproducts");
        const activeProducts = response.data.filter((product) => product.status === "active");
        setProducts(activeProducts);

        const reviewsData = {};
        for (const product of activeProducts) {
          try {
            const reviewResponse = await axios.get(`http://localhost:8080/api/reviews/${product._id}`);
            reviewsData[product._id] = reviewResponse.data;
          } catch {
            reviewsData[product._id] = [];
          }
        }
        setComments(reviewsData);
      } catch {
        console.error("Error fetching products");
      }
    };
    fetchActiveProducts();
  }, []);

  const handleImageClick = (product) => {
    navigate(`/deals`, { state: { product } });
  };

  const handleAddComment = async (productId) => {
    if (!newComment[productId]?.trim()) return;

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");

    if (!token || !username) return;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;
    try {
      const response = await axios.post(`http://localhost:8080/api/reviews/${productId}`, {
        productId,
        userId,
         username,
        text: newComment[productId],
      });

      setComments((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), response.data],
      }));
      setNewComment((prev) => ({ ...prev, [productId]: "" }));
      setShowReviewInput((prev) => ({ ...prev, [productId]: false }));
    } catch {
      console.error("Error adding review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12 drop-shadow-md">
        Featured Products
      </h2>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-6 mb-8">
        {["All", "Kitchen Finds", "Home Decor", "Aesthetic Look"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 dark:bg-gray-700 dark:text-white hover:shadow-xl"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={-300}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="pb-12"
      >
        {products
          .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
          .map((product) => (
            <SwiperSlide key={product._id} className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full sm:w-64 p-4 relative transition-transform hover:scale-105 hover:shadow-2xl">
                {/* Image Container */}
                <div
                  className="relative cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => handleImageClick(product)}
                >
                  <img
                    src={`http://localhost:8080/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl transition-transform hover:scale-110"
                  />
                  {/* Floating Category Label */}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <h3 className="text-md font-bold text-gray-900 dark:text-white mt-4">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                  {product.description}
                </p>

                {/* Buy Now Button */}
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-500 shadow-md transition-all text-sm"
                  onClick={() => window.location.href = product.buyLink}
                >
                  Buy Now
                </button>

                {/* Reviews Section */}
                <div className="mt-4 bg-white dark:bg-gray-900 bg-opacity-70 p-3 rounded-lg shadow-md">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Customer Reviews:
                  </h4>
                  <div className="max-h-20 overflow-y-auto text-xs space-y-1 mt-2">
                    {comments[product._id]?.length > 0 ? (
                      comments[product._id].map((review, index) => (
                        <p key={index} className="text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 p-1 rounded-md">
                          <span className="font-bold text-gray-900 dark:text-white">{review.username}:</span> {review.text}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400">No reviews yet.</p>
                    )}
                  </div>
                </div>

                {/* Write a Review Button */}
                <button
                  onClick={() =>
                    setShowReviewInput((prev) => ({
                      ...prev,
                      [product._id]: !prev[product._id],
                    }))
                  }
                  className="mt-3 w-full bg-gray-800 text-white py-1 rounded-lg hover:bg-gray-700 shadow-md transition-all text-sm"
                >
                  Write a Review
                </button>

                {/* Review Input */}
                {showReviewInput[product._id] && (
                  <div className="mt-3 flex items-center">
                    <input
                      type="text"
                      value={newComment[product._id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [product._id]: e.target.value }))
                      }
                      placeholder="Write a review..."
                      className="flex-1 p-1 text-xs bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(product._id)}
                      className="ml-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-400 transition-all text-xs"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default VlogCard;
