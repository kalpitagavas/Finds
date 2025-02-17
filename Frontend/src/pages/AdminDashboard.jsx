import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    status: "active",
    description: "",
    images: [], // Store multiple image files
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
      images: [...prev.images, ...Array.from(e.target.files)], // Merge old and new images
    }));
  };


    // Remove an image from the selection
    const handleRemoveImage = (index) => {
        setNewProduct((prev) => {
          // Create a copy of the images array
          const updatedImages = [...prev.images];
          // Remove the image at the specified index
          updatedImages.splice(index, 1);
          // Return the updated state
          return { ...prev, images: updatedImages };
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
    newProduct.images.forEach((image) => {
      formData.append("images", image); // Append each image file
    });

    try {
      if (isUpdating) {
        await axios.put(`http://localhost:8080/api/admin/products/${currentProductId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProducts((prev) =>
          prev.map((product) =>
            product._id === currentProductId ? { ...product, ...newProduct } : product
          )
        );
      } else {
        const response = await axios.post("http://localhost:8080/api/admin/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProducts((prev) => [...prev, response.data]);
      }
      setNewProduct({
        name: "",
        price: "",
        status: "active",
        description: "",
        images: [],
      });
      setIsUpdating(false);
      setCurrentProductId(null);
    } catch (error) {
      console.error("Error submitting product:", error.response || error.message);
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
      images: [], // Reset images on update
    });
    setIsUpdating(true);
    setCurrentProductId(product._id);
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
    
    {/* Image Preview Section */}
    {newProduct.images.length > 0 && (
  <div className="image-previews mt-4">
    <h4 className="font-medium">Selected Images:</h4>
    <div className="flex space-x-2">
      {newProduct.images.map((image, index) => (
        <div key={index} className="w-16 h-16 relative">
          <img
            src={URL.createObjectURL(image)} // Preview the selected image
            alt={`Selected image ${index + 1}`}
            className="object-cover w-full h-full rounded"
          />
          <button
            onClick={() => handleRemoveImage(index)} // Remove image on click
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
)}

    {/* Image File Input */}
    <input
      type="file"
      name="images"
      onChange={handleImageChange}
      accept="image/*"
      multiple
      className="w-full"
    />

    {/* Display Existing Images if Updating */}
    {isUpdating && currentProductId && products.length > 0 && (
      <div className="existing-images mt-4">
        <h4 className="font-medium">Existing Images:</h4>
        <div className="flex space-x-2">
          {products.find(p => p._id === currentProductId).images.map((image, index) => (
            <div key={index} className="w-16 h-16">
              <img
                src={`http://localhost:8080/${image}`} // Existing images from the server
                alt={`Existing product image ${index + 1}`}
                className="object-cover w-full h-full rounded"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    <select
      name="status"
      value={newProduct.status}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
    >
      {isUpdating ? "Update Product" : "Add Product"}
    </button>
  </form>
</div>
    </div>
  );
};

export default AdminDashboard;
