import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const CarouselComponent = () => {
  return (
    <div className="relative mx-auto mt-10 max-w-6xl">
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
        <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] flex justify-center items-center bg-black relative">
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
        <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] relative">
          <img
            src="../src/assets/image1.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] relative">
          <img
            src="https://www.decorilla.com/online-decorating/wp-content/uploads/2023/08/Best-interior-design-blogs-and-websites.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </Carousel>

      {/* Floating Image on Bottom-Left */}
      <div className="absolute bottom-[-40px] left-[-40px] md:bottom-[-50px] md:left-[-50px] transform transition-transform hover:scale-110 z-10">
        <img
          src="https://i.pinimg.com/550x/f2/ea/64/f2ea645831ef1c64cd71e7b0b1cf9501.jpg"
          alt="Floating Image"
          className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full border-4 border-white shadow-lg bg-white/30 backdrop-blur-md"
        />
      </div>

      {/* Overlay Text with Fade-In Effect */}
      <div className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-center text-white animate__animated animate__fadeIn">
        <h2 className="text-sm md:text-lg font-bold bg-orange-900 rounded-full p-2 md:p-3">
          Amazing Experiences Await
        </h2>
        <p className="mt-1 md:mt-2 text-xs md:text-sm">
          Discover something new every day.
        </p>

        {/* Explore Button */}
        <a
          href="#explore"
          className="inline-block mt-3 md:mt-4 px-4 md:px-5 py-2 text-xs md:text-sm font-semibold bg-orange-900 text-white rounded-full hover:bg-orange-800 transition-all"
        >
          Explore More
        </a>
      </div>
    </div>
  );
};

export default CarouselComponent;
