import React from 'react';

const Modal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto shadow-xl transform transition-all duration-300">
        
        {/* Fixed Header with Title and Close Button */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-white dark:bg-gray-800 z-10 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 text-3xl hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Main Content Area (Product Details) */}
        <div className="mt-16">
          <img
            src={`http://localhost:8080/${product.images[0]}`}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold text-gray-900 mt-4">{product.name}</h3>
          <p className="text-gray-500 mt-2">{product.description}</p>
          <p className="text-xl font-semibold text-gray-900 mt-4">Rs.{product.price}</p>

          {/* Affiliate Link Button */}
          {product.buyLink && (
            <a
              href={product.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Buy Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
