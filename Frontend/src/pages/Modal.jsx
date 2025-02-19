import { useState, useEffect, useRef } from "react";

const Modal = ({ product, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const media = [...product.images, ...product.videos];
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;

    // If the current media is an image, change every 3 seconds
    if (!media[currentMediaIndex].includes(".mp4")) {
      interval = setInterval(() => {
        setCurrentMediaIndex((prevIndex) => (prevIndex < media.length - 1 ? prevIndex + 1 : 0));
      }, 3000);
    } else {
      // If the current media is a video, wait until it ends before switching
      const video = videoRef.current;
      if (video) {
        video.onended = () => {
          setCurrentMediaIndex((prevIndex) => (prevIndex < media.length - 1 ? prevIndex + 1 : 0));
        };
      }
    }

    return () => clearInterval(interval);
  }, [currentMediaIndex, media.length]);

  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex < media.length - 1 ? prevIndex + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : media.length - 1));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 max-w-lg mx-auto relative">
        <button className="absolute top-2 right-2 text-gray-700 hover:text-gray-900" onClick={onClose}>
          ✖
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-center">{product.name}</h2>

        {/* Display Image or Video */}
        <div className="relative">
          {media[currentMediaIndex].includes(".mp4") ? (
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded mb-4"
              controls
              autoPlay
              muted
            >
              <source src={`http://localhost:8080/${media[currentMediaIndex]}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={`http://localhost:8080/${media[currentMediaIndex]}`}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
          )}

          {/* Navigation Buttons */}
          {media.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-2 text-white text-2xl bg-black bg-opacity-50 px-2 py-1 rounded"
                onClick={handlePrev}
              >
                ❮
              </button>
              <button
                className="absolute top-1/2 right-2 text-white text-2xl bg-black bg-opacity-50 px-2 py-1 rounded"
                onClick={handleNext}
              >
                ❯
              </button>
            </>
          )}
        </div>

        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-gray-900 mb-4">${product.price}</p>
      </div>
    </div>
  );
};

export default Modal;
