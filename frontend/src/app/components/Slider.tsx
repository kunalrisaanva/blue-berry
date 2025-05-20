"use client";

import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";

const slides = [
  {
    id: 1,
    title: "New Year Eve discount",
    subtitle: "Flat Sale 20% Off",
    description: "Get discount in your most favorite brands and products.",
    code: "BERRY",
    discount: "20%",
    image:
      "https://cdn.sanity.io/images/szo9br23/production/db699e24ded5fc01b0cb160530f7cba4f5a484eb-600x600.png?w=1000&h=1000",
  },
  {
    id: 2,
    title: "Ongoing Flash Sale ",
    subtitle: "Flat Sale 15% Off",
    description: "Get the best we can offer for you in this season",
    code: "BERRY",
    discount: "15%",
    image:
      "https://cdn.sanity.io/images/szo9br23/production/69ddc3833900918beff69bb3eed0f3eba7509c01-600x600.png?w=1000&h=1000",
  },
  {
    id: 3,
    title: "New Year Eve offer",
    subtitle: "Flat Sale 35% Off",
    description: "Get discount in your most favorite brands and products.",
    code: "BERRY",
    discount: "35%",
    image:
      "https://cdn.sanity.io/images/szo9br23/production/a8875e35486a3aa66f994dd066c3be0ea08a91a1-600x600.png?w=1000&h=1000",
  },
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full mt-8 max-w-7xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white border-2 border-gray-200">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full flex flex-col md:flex-row items-center justify-between "
          >
            {/* Text Content */}
            <div className="md:w-1/2 p-6 px-20 space-y-6">
              <span className="text-xs font-semibold text-blue-500 bg-gray-100 px-2 py-1  rounded">
                {slide.subtitle}
              </span>
              <h2 className="text-4xl pt-4 font-bold text-gray-900">
                {slide.title}
              </h2>
              <p className="text-gray-600">{slide.description}</p>
              <p className="text-gray-800">
                Use code: <span className="font-bold">{slide.code}</span> for{" "}
                <span className="font-bold">{slide.discount}</span> OFF
              </p>
              <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition">
                Shop Now
              </button>
            </div>

            {/* Image */}
            <div className="md:w-1/2 relative group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
        aria-label="Previous Slide"
      >
        <IoMdArrowRoundBack />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
        aria-label="Next Slide"
      >
        <IoMdArrowRoundForward />
      </button>
    </div>
  );
};

export default Slider;
