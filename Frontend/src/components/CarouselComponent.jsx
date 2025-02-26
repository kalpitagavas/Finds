import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const CarouselComponent = () => {
  return (
    <div className="relative mx-auto mt-10 max-w-7xl">
      {/* Carousel */}
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        interval={5000}
        className="relative"
        transitionTime={800}
        emulateTouch={true}
      >
        {/* Video Slide */}
        <div className="w-full h-[500px] md:h-[600px] flex justify-center items-center bg-black relative">
          <video
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-cover rounded-lg"
          >
            <source src="../src/assets/video1.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Image Slides */}
        <div className="w-full h-[500px] md:h-[600px] relative">
          <img
            src="../src/assets/image1.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full h-[500px] md:h-[600px] relative">
          <img
            src="https://www.decorilla.com/online-decorating/wp-content/uploads/2023/08/Best-interior-design-blogs-and-websites.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </Carousel>

      {/* Larger Floating Image on Bottom-Left (Half Inside, Half Outside) */}
      <div className="absolute bottom-[-70px] left-[-70px] md:bottom-[-80px] md:left-[-80px] transform transition-transform hover:scale-110 z-10">
        <img
          src="https://i.pinimg.com/550x/f2/ea/64/f2ea645831ef1c64cd71e7b0b1cf9501.jpg"
          alt="Floating Image"
          className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-full border-6 border-white shadow-2xl bg-white/30 backdrop-blur-md"
        />
      </div>

      {/* Optional Overlay Text with Fade-In Effect */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-center rounded-full text-white animate__animated animate__fadeIn">
        <h2 className="text-1xl font-bold bg-orange-900 rounded-full p-4">
          Amazing Experiences Await
        </h2>
        <p className="mt-4 text-xl">Discover something new every day.</p>

        {/* Optional Explore Button */}
        <a
          href="#explore"
          className="inline-block mt-6 px-6 py-3 text-lg font-semibold bg-orange-900 text-white rounded-full hover:bg-orange-900 transition-all"
        >
          Explore More
        </a>
      </div>
    </div>
  );
};

export default CarouselComponent;
