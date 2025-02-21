import { useState, useEffect } from 'react';

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState('low-to-high'); // Default sort option

  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW745QW1Sedtbdf3tA6rFgxu3sv3A3Rxnvxg&s',
      price: 49.99,
      originalPrice: 79.99,
      description: 'High-quality wireless earbuds with noise cancellation.',
      specifications: 'Bluetooth 5.0, 12-hour battery life, 10m range',
      benefits: 'Noise cancellation, comfortable fit, long battery life',
      customerReviews: [
        { rating: 5, comment: 'Excellent sound quality!' },
        { rating: 4, comment: 'Very comfortable to wear.' },
      ],
      discount: 40,
      tags: ['New', 'Best Seller'],
      buyLink: 'https://www.example.com/buy/earbuds',
      category: 'Electronics',
      brand: 'AudioPro',
      rating: 4.5,
      reviewsCount: 120,
    }, {
      id: 2,
      name: 'Wireless Earbuds',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW745QW1Sedtbdf3tA6rFgxu3sv3A3Rxnvxg&s',
      price: 49.99,
      originalPrice: 79.99,
      description: 'High-quality wireless earbuds with noise cancellation.',
      specifications: 'Bluetooth 5.0, 12-hour battery life, 10m range',
      benefits: 'Noise cancellation, comfortable fit, long battery life',
      customerReviews: [
        { rating: 5, comment: 'Excellent sound quality!' },
        { rating: 4, comment: 'Very comfortable to wear.' },
      ],
      discount: 40,
      tags: ['New', 'Best Seller'],
      buyLink: 'https://www.example.com/buy/earbuds',
      category: 'Electronics',
      brand: 'AudioPro',
      rating: 4.5,
      reviewsCount: 120,
    }, {
      id: 3,
      name: 'Wireless Earbuds',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW745QW1Sedtbdf3tA6rFgxu3sv3A3Rxnvxg&s',
      price: 50.99,
      originalPrice: 79.99,
      description: 'High-quality wireless earbuds with noise cancellation.',
      specifications: 'Bluetooth 5.0, 12-hour battery life, 10m range',
      benefits: 'Noise cancellation, comfortable fit, long battery life',
      customerReviews: [
        { rating: 5, comment: 'Excellent sound quality!' },
        { rating: 4, comment: 'Very comfortable to wear.' },
      ],
      discount: 40,
      tags: ['New', 'Best Seller'],
      buyLink: 'https://www.example.com/buy/earbuds',
      category: 'Electronics',
      brand: 'AudioPro',
      rating: 4.5,
      reviewsCount: 120,
    }, {
      id: 4,
      name: 'Wireless Earbuds',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW745QW1Sedtbdf3tA6rFgxu3sv3A3Rxnvxg&s',
      price: 69.99,
      originalPrice: 79.99,
      description: 'High-quality wireless earbuds with noise cancellation.',
      specifications: 'Bluetooth 5.0, 12-hour battery life, 10m range',
      benefits: 'Noise cancellation, comfortable fit, long battery life',
      customerReviews: [
        { rating: 5, comment: 'Excellent sound quality!' },
        { rating: 4, comment: 'Very comfortable to wear.' },
      ],
      discount: 40,
      tags: ['New', 'Best Seller'],
      buyLink: 'https://www.example.com/buy/earbuds',
      category: 'Electronics',
      brand: 'AudioPro',
      rating: 4.5,
      reviewsCount: 120,
    }, {
      id: 5,
      name: 'Wireless Earbuds',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW745QW1Sedtbdf3tA6rFgxu3sv3A3Rxnvxg&s',
      price: 70.99,
      originalPrice: 79.99,
      description: 'High-quality wireless earbuds with noise cancellation.',
      specifications: 'Bluetooth 5.0, 12-hour battery life, 10m range',
      benefits: 'Noise cancellation, comfortable fit, long battery life',
      customerReviews: [
        { rating: 5, comment: 'Excellent sound quality!' },
        { rating: 4, comment: 'Very comfortable to wear.' },
      ],
      discount: 40,
      tags: ['New', 'Best Seller'],
      buyLink: 'https://www.example.com/buy/earbuds',
      category: 'Electronics',
      brand: 'AudioPro',
      rating: 4.5,
      reviewsCount: 120,
    },
    // More products...
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Sorting function
  const sortProducts = (products, sortOption) => {
    const sortedProducts = [...products];
    if (sortOption === 'low-to-high') {
      return sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
      return sortedProducts.sort((a, b) => b.price - a.price);
    }
    return sortedProducts;
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Best Deals</h1>

      {/* Sort Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortProducts(products, sortOption).map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              className="w-full h-32 object-cover"
              src={product.image}
              alt={product.name}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-800">{`Rs.${product.price.toFixed(2)}`}</span>
                  <span className="text-sm text-gray-500 line-through">{`Rs.${product.originalPrice.toFixed(2)}`}</span>
                  <span className="text-sm text-green-500">{product.discount}% off</span>
                </div>
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#6a1110] to-[#d05827] text-white text-base py-2 px-4 rounded-lg hover:from-[#6a1110] hover:to-[#d05827] transition duration-300 ease-in-out"
                >
                  Buy Now
                </a>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag, index) => (
                  <span key={index} className="bg-orange-900 text-white text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* View More Button */}
              <button
                onClick={() => handleProductClick(product)}
                className="mt-4 text-xs text-orange-900 hover:text-orange-900"
              >
                View More Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Expanded Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 lg:w-1/2 xl:w-1/3">
            <h3 className="text-2xl font-semibold text-gray-800">{selectedProduct.name}</h3>
            <img
              className="w-full h-48 object-cover mt-4"
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />
            <p className="text-sm text-gray-600 mt-2">{selectedProduct.description}</p>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-800">{`Rs.${selectedProduct.price.toFixed(2)}`}</span>
                <span className="text-sm text-gray-500 line-through">{`Rs.${selectedProduct.originalPrice.toFixed(2)}`}</span>
                <span className="text-sm text-green-500">{selectedProduct.discount}% off</span>
              </div>
            </div>

            {/* Expanded Information */}
            <div className="mt-4">
              <p className="text-sm text-gray-800 font-semibold">Specifications</p>
              <p className="text-xs text-gray-600">{selectedProduct.specifications}</p>

              <p className="text-sm text-gray-800 font-semibold mt-4">Benefits</p>
              <p className="text-xs text-gray-600">{selectedProduct.benefits}</p>

              <p className="text-sm text-gray-800 font-semibold mt-4">Customer Reviews</p>
              {selectedProduct.customerReviews.length > 0 ? (
                selectedProduct.customerReviews.map((review, index) => (
                  <div key={index} className="mt-2">
                    <p className="text-xs text-gray-600">Rating: {review.rating} stars</p>
                    <p className="text-xs text-gray-500">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No reviews yet.</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="mt-6 bg-orange-900 text-white py-2 px-4 rounded-lg w-full hover:bg-orange-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;