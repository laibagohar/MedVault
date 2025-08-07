import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/carousel.css';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';

const images = [img1, img2, img3];


function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // auto-change every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <button className="carousel-btn left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      <img src={images[current]} alt="carousel" className="carousel-image" />

      <button className="carousel-btn right" onClick={nextSlide}>
        <FaChevronRight />
      </button>
    </div>
  );
}

export default Carousel;
