// ImageCarousel.tsx
import React, { useState, useEffect } from 'react';
import ok1 from '/assets/ok1.jpeg'
import ok2 from '/assets/ok2.jpeg'
import ok3 from '/assets/ok3.jpeg'
import ok4 from '/assets/ok4.jpeg'

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample images - replace with your actual image paths
  const images: CarouselImage[] = [
    {
      id: 1,
      src: ok1,
      alt: "Credit Card Offer 1"
    },
    {
      id: 2,
      src: ok2,
      alt: "Credit Card Offer 2"
    },
    {
      id: 3,
      src: ok3,
      alt: "Credit Card Offer 3"
    },
    {
      id: 4,
      src: ok4,
      alt: "Credit Card Offer 4"
      
    }
  ];

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full mx-auto mb-8">
      {/* Carousel Container */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition duration-200 hidden sm:block"
        aria-label="Previous image"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition duration-200 hidden sm:block"
        aria-label="Next image"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;