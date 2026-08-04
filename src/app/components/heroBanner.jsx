"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HeroBanner = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback banner if database has no active banners
  const displayBanners = banners.length > 0 ? banners : [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Luxury Resorts for Every Journey",
      description: "From beachfront escapes to mountain retreats, find the perfect destination for relaxation, adventure, and memorable moments.",
      buttonText: "Book Now"
    }
  ];

  useEffect(() => {
    if (displayBanners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBanners.length);
    }, 3000); // changes slide every 3 seconds

    return () => clearInterval(interval);
  }, [displayBanners.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayBanners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBanners.length);
  };

  return (
    <div
      className="relative hero-banner-height w-full overflow-hidden mt-5 rounded-2xl shadow-lg border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {displayBanners.map((slide, index) => (
        <div
          key={slide._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Banner Image */}
          <div className="relative w-full h-full">
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Overlay - clean dark gradient for high readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30"></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12">
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md max-w-4xl transform transition-all duration-700">
              {slide.title}
            </h1>

            <p className="max-w-2xl text-sm md:text-lg text-gray-200 drop-shadow-sm mb-6 line-clamp-3">
              {slide.description}
            </p>

            {slide.buttonText && (
              <Link href="/resorts">
                <button className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 md:px-8 md:py-3.5 font-bold text-white transition hover:scale-105 hover:shadow-lg active:scale-95 duration-200 cursor-pointer shadow-md">
                  {slide.buttonText}
                </button>
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Controls (show only if multiple slides exist) */}
      {displayBanners.length > 1 && (
        <>
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-2.5 backdrop-blur-md transition duration-200 border border-white/10 hover:scale-110 cursor-pointer focus:outline-none"
            aria-label="Previous Slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-2.5 backdrop-blur-md transition duration-200 border border-white/10 hover:scale-110 cursor-pointer focus:outline-none"
            aria-label="Next Slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Pagination Indicators (dots) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'w-6 bg-orange-500' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBanner;
