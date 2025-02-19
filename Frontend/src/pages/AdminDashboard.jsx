import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    status: "active",
    description: "",
    category: "", // Added category field
    images: [],
    existingImages: [],
    removedImages: [],
    videos: [],
    existingVideos: [],
    removedVideos: [],
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Fetch all products for the admin dashboard
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

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change (multiple images)
  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...Array.from(e.target.files)], // Appending new images
    }));
  };

  // Remove an image from the selection
  const handleRemoveImage = (index) => {
    setNewProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  // Handle video input change (multiple videos)
  const handleVideoChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      videos: [...prev.videos, ...Array.from(e.target.files)],
    }));
  };

  // Remove a video from the selection
  const handleRemoveVideo = (index) => {
    setNewProduct((prev) => {
      const updatedVideos = [...prev.videos];
      updatedVideos.splice(index, 1);
      return { ...prev, videos: updatedVideos };
    });
  };

  // Handle adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("status", newProduct.status);
    formData.append("category", newProduct.category); // Added category field
  
    // Append images to formData
    newProduct.images.forEach((image) => formData.append("images", image));
    
    // Append videos to formData
    newProduct.videos.forEach((video) => formData.append("videos", video));
    
    // Append existing images and videos
    newProduct.existingImages.forEach((image) => formData.append("existingImages", image));
    newProduct.existingVideos.forEach((video) => formData.append("existingVideos", video));
    
    // Append removed images and videos
    newProduct.removedImages.forEach((image) => formData.append("removedImages", image));
    newProduct.removedVideos.forEach((video) => formData.append("removedVideos", video));
  
    try {
      const url = isUpdating
        ? `http://localhost:8080/api/admin/products/${currentProductId}`
        : "http://localhost:8080/api/admin/products";
      const method = isUpdating ? "put" : "post";
      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log(isUpdating ? "✅ Product updated" : "✅ Product added:", response.data);
      setIsUpdating(false);
      setCurrentProductId(null);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error submitting product:", error.response?.data || error.message);
    }
  };
  
  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle updating a product
  const handleUpdateProduct = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      status: product.status,
      description: product.description,
      category: product.category || "", // Update category when updating a product
      images: [],
      existingImages: product.images || [],
      removedImages: [],
    });

    setIsUpdating(true);
    setCurrentProductId(product._id);
  };

  // Handle removing an existing image
  const handleRemoveExistingImage = (index) => {
    setNewProduct((prev) => {
      const updatedExistingImages = [...prev.existingImages];
      const removedImage = updatedExistingImages.splice(index, 1); // Remove selected image

      return {
        ...prev,
        existingImages: updatedExistingImages, // Update existingImages
        removedImages: [...(prev.removedImages || []), removedImage[0]], // Track removed images separately
      };
    });
  };

  return (
    <div className="admin-dashboard p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Product List */}
      <div className="product-list space-y-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="product-card bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="flex items-center space-x-4">
                {product.images.length > 0 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8080/${image}`}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="font-medium text-gray-800">Price: ${product.price}</p>
                  <p className={product.status === "active" ? "text-green-600" : "text-red-600"}>
                    Status: {product.status}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateProduct(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No products available.</p>
        )}
      </div>

      {/* Add or Update Product Form */}
      <div className="product-form mt-12 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h3 className="text-2xl font-bold text-center mb-6">
          {isUpdating ? "Update Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Product Price"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Category Selection */}
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Kitchen Finds">Kitchen Finds</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Aesthetic Look">Aesthetic Look</option>
          </select>

          {/* Display newly added images */}
          {newProduct.images.length > 0 && (
            <div className="image-previews mt-4">
              <h4 className="text-xl font-medium mb-2">Selected Images:</h4>
              <div className="grid grid-cols-3 gap-2">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 text-white bg-red-600 p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
<input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImageChange}
  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
          {/* Display existing images */}
          {newProduct.existingImages.length > 0 && (
            <div className="existing-images mt-4">
              <h4 className="text-xl font-medium mb-2">Existing Images:</h4>
              <div className="grid grid-cols-3 gap-2">
                {newProduct.existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:8080/${image}`}
                      alt={`Existing Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-0 right-0 text-white bg-red-600 p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video selection */}
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isUpdating ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
