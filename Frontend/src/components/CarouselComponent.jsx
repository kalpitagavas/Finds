import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const CarouselComponent = () => {
  return (
    <div className="max-w-4xl mx-auto mt-4">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        interval={5000}
      >
        {/* Video Slide */}
        <div className="w-full h-[300px] md:h-[400px] flex justify-center items-center bg-black">
          <video controls autoPlay muted loop className="w-full h-full object-cover rounded-lg">
            <source src="../src/assets/video1.mp4" type="video/mp4" />
            <source src="../src/assets/video2.mp4" type="video/mp4" />
           
          </video>
        </div>

        {/* Image Slides */}
        <div className="w-full h-[300px] md:h-[400px] flex justify-center items-center bg-gray-200">
          <img src="../src/assets/image1.jpg" alt="Slide 1" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="w-full h-[300px] md:h-[400px] flex justify-center items-center bg-gray-200">
          <img src="../src/assets/image2.jpg" alt="Slide 2" className="w-full h-full object-cover rounded-lg" />
        </div>
        
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
