// Modal.js
import React, { useState, useEffect } from "react";

const Modal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [product.images.length]);

  const handleNext = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 z-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        {product.images.length > 0 ? (
          <div className="relative">
            <img
              src={`http://localhost:8080/${product.images[currentImageIndex]}`}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-3xl cursor-pointer" onClick={handlePrev}>
              &lt;
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-3xl cursor-pointer" onClick={handleNext}>
              &gt;
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-4">No images available.</p>
        )}
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-gray-900 mb-4">${product.price}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
