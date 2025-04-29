import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const sliderRef = useRef(null);

  const settings = {
    autoplay: false, // Enable autoplay // Change video every 5 seconds
    infinite: true, // Loop infinitely
    slidesToShow: 1, // Show one video at a time
    slidesToScroll: 1, // Scroll one video at a time
    arrows: false, // Hide navigation arrows
    dots: true, // Show dots for navigation
    beforeChange: (current, next) => {
      // Pause the video when it is no longer visible
      const videos = document.querySelectorAll("video");
      videos[current]?.pause();
      videos[current]?.load();
      console.log('this here works');
      console.log(current);
      console.log(next);
    },
    afterChange: async (current, next) => {
      // Pause the video when it is no longer visible
      const videos = document.querySelectorAll("video");
      videos[current]?.load();
      videos[current].currentTime = 0;
      await videos[current]?.play().catch( () => {console.log("FAILURE HAPPENED")});
      console.log('this here works');
      console.log(current);
    },
  };

  const videoSlides = [
    "https://res.cloudinary.com/dr9yx1tod/video/upload/v1745960487/uploaded_Videos/video-1745960335615.mp4",
    "https://res.cloudinary.com/dr9yx1tod/video/upload/v1745960307/uploaded_Videos/video-1745960198748.mp4",
    "https://res.cloudinary.com/dr9yx1tod/video/upload/v1745960178/uploaded_Videos/video-1745960000506.mp4",
    "https://res.cloudinary.com/dr9yx1tod/video/upload/v1745958400/uploaded_Videos/video-1745958309042.mp4",
    "https://res.cloudinary.com/dr9yx1tod/video/upload/v1745955261/RepairShops_lqfxb9.mp4"
  ];

  const handleVideoEnd = () => {
    if (sliderRef.current) {
      console.log('data changed from', sliderRef.current.slickNext());
      console.log('data changed to', sliderRef.current) // Go to next slide when video finishes
    }
  };

  return (
    <div className="carousel-container-Big">
      <div className="carousel-container">
        <Slider {...settings} ref={sliderRef}>
          {videoSlides.map((video, index) => (
            <div className="slide" key={index}>
              <div className="banner">
                <div className="video-wrapper">
                  <video
                  muted
                  autoPlay
                  onEnded={handleVideoEnd}
                    className="background-video"
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
