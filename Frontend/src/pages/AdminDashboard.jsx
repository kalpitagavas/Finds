import { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    status: "active",
    description: "",
    images: [],  // Separate images
    videos: [],  // Separate videos
    category: "",
    specifications: "",
    benefits: "",
    discount: "",
    tags: [],
    buyLink: "",
    brand: "",
    rating: 0,
    reviewsCount: 0,
    customerReviews: [],
  });
  const [darkMode, setDarkMode] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Modal open/close
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setIsUpdating(false);
    setCurrentProductId(null);
    setNewProduct({
      name: "",
      price: "",
      originalPrice: "",
      status: "active",
      description: "",
      images: [],  // Reset images
      videos: [],  // Reset videos
      category: "",
      specifications: "",
      benefits: "",
      discount: "",
      tags: [],
      buyLink: "",
      brand: "",
      rating: 0,
      reviewsCount: 0,
      customerReviews: [],
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle file changes (images & videos)
  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setNewProduct(prev => ({
      ...prev,
      [type]: [...prev[type], ...files] // Add files to the corresponding array (images/videos)
    }));
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product (populate form & open modal)
  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      status: product.status,
      description: product.description,
      images: product.images || [],
      videos: product.videos || [],
      category: product.category,
      specifications: product.specifications,
      benefits: product.benefits,
      discount: product.discount,
      tags: product.tags || [],
      buyLink: product.buyLink,
      brand: product.brand,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      customerReviews: product.customerReviews || [],
    });
    setIsUpdating(true);
    setCurrentProductId(product._id);
    openModal();
  };

  // Submit form (add/update product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form fields to FormData
    Object.keys(newProduct).forEach(key => {
      if (Array.isArray(newProduct[key])) {
        // Handle arrays (images and videos)
        newProduct[key].forEach(item => {
          formData.append(key, item);
        });
      } else {
        // Handle other fields
        formData.append(key, newProduct[key]);
      }
    });

    try {
      const url = isUpdating
        ? `http://localhost:8080/api/admin/products/${currentProductId}`
        : "http://localhost:8080/api/admin/products";
      const method = isUpdating ? "put" : "post";
      await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.location.reload();
    } catch (error) {
      console.error("Error submitting product:", error.response?.data || error.message);
    }
  };

  // Combine images and videos into a single array for carousel rendering
  const renderCarouselItems = (product) => {
    const mediaItems = [
      ...product.images.map(image => ({ type: "image", src: `http://localhost:8080/${image}` })),
      ...product.videos.map(video => ({ type: "video", src: `http://localhost:8080/${video}` }))
    ];

    return mediaItems.map((item, index) => (
      <div key={index}>
        {item.type === "image" ? (
          <img className="w-full h-48 object-cover rounded" src={item.src} alt={`Product media ${index + 1}`} />
        ) : (
          <video className="w-full h-48 object-cover rounded" controls preload="auto" autoPlay muted  src={item.src} alt={`Product video ${index + 1}`}>
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    ));
  };

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="hover:text-gray-300 transition">Products</a>
            </li>
            <li className="mb-4">
              <a href="#" className="hover:text-gray-300 transition">Orders</a>
            </li>
            <li className="mb-4">
              <a href="#" className="hover:text-gray-300 transition">Settings</a>
            </li>
          </ul>
        </nav>
        <button onClick={toggleDarkMode} className="mt-12 p-3 bg-gray-600 rounded-lg text-white w-full">
          Toggle Mode
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Products</h1>
          <button onClick={openModal} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition">
            Add Product
          </button>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-xl">
                {/* Product Images and Videos Carousel */}
                <Carousel showThumbs={false} infiniteLoop autoPlay>
                  {renderCarouselItems(product)}
                </Carousel>
                {/* Product Name */}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                {/* Product Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
                {/* Product Specifications */}
                <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Specifications:</strong> {product.specifications}</p>
                {/* Product Benefits */}
                <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Benefits:</strong> {product.benefits}</p>
                {/* Product Price and Original Price */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">${product.originalPrice}</span>
                  )}
                </div>
                {/* Product Discount */}
                {product.discount && <p className="text-sm text-green-500 dark:text-green-400 mb-2"><strong>Dsicount:</strong>  {product.discount}%</p>}
                {/* Product Category */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category: {product.category}</p>
                {/* Product Brand */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Brand: {product.brand}</p>
                {/* Product Status */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status: {product.status}</p>
                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags: {product.tags.join(', ')}</p>
                )}
                {/* Product Rating */}
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({product.reviewsCount} reviews)</span>
                </div>
                {/* Buy Link */}
                {product.buyLink && (
                  <a href={product.buyLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline mb-4 block">
                    Buy Now
                  </a>
                )}
                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available.</p>
        )}
      </main>

      {/* Modal for Add/Edit Product */}
      {modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto shadow-xl transform transition-all duration-300">
      
      {/* Fixed Header with Title and Close Button */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-white dark:bg-gray-800 z-10 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {isUpdating ? "Update Product" : "Add Product"}
        </h2>
        <button
          onClick={closeModal}
          className="text-gray-600 dark:text-gray-300 text-3xl hover:text-red-500"
        >
          &times;
        </button>
      </div>

      {/* Main Content Area (Form) */}
      <form onSubmit={handleSubmit} className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            required
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={newProduct.originalPrice}
            onChange={handleInputChange}
            placeholder="Enter original price"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
          <select
            name="status"
            value={newProduct.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Specifications</label>
          <textarea
            name="specifications"
            value={newProduct.specifications}
            onChange={handleInputChange}
            placeholder="Enter product specifications"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Benefits</label>
          <textarea
            name="benefits"
            value={newProduct.benefits}
            onChange={handleInputChange}
            placeholder="Enter product benefits"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Discount</label>
          <input
            type="number"
            name="discount"
            value={newProduct.discount}
            onChange={handleInputChange}
            placeholder="Enter discount percentage"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={newProduct.tags.join(', ')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'tags',
                value: e.target.value.split(',').map(tag => tag.trim())
              }
            })}
            placeholder="Enter product tags"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Buy Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Buy Link</label>
          <input
            type="text"
            name="buyLink"
            value={newProduct.buyLink}
            onChange={handleInputChange}
            placeholder="Enter buy link"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={newProduct.brand}
            onChange={handleInputChange}
            placeholder="Enter product brand"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Rating (1 to 5)</label>
          <input
            type="number"
            name="rating"
            value={newProduct.rating}
            onChange={handleInputChange}
            placeholder="Enter product rating"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            min="0"
            max="5"
          />
        </div>

        {/* Reviews Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Reviews Count</label>
          <input
            type="number"
            name="reviewsCount"
            value={newProduct.reviewsCount}
            onChange={handleInputChange}
            placeholder="Enter number of reviews"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* Customer Reviews */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Customer Reviews</label>
          <textarea
            name="customerReviews"
            value={newProduct.customerReviews.join('\n')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'customerReviews',
                value: e.target.value.split('\n').map(review => review.trim())
              }
            })}
            placeholder="Customer reviews (one per line)"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
          />
        </div>

        {/* File Inputs for Images and Videos */}
        <div className="flex space-x-2 mb-4">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "images")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            multiple
            accept="image/*"
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "videos")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150"
            multiple
            accept="video/*"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition ease-in-out duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
