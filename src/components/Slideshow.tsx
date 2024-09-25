import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  title: string;
}

interface SlideshowProps {
  images: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    // Cambia slide dopo qualche secondo
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    // Pulizia dell'intervallo quando il componente viene smontato
    return () => clearInterval(interval);
  }, [nextSlide]); // nextSlide ora è stabile e non cambia ad ogni render

  return (
    <div className="relative w-full h-[553px] md:h-[500px] lg:h-[590px] mb-10 font-titolo">
      {/* Slideshow container */}
      {images.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-0 left-0 text-white text-sm p-2 bg-black bg-opacity-50">
            {index + 1} / {images.length}
          </div>

          <div className="w-full h-full object-cover">
            <Image
              src={slide.src || "/placeholder-image.png"}
              alt={slide.title || "immagine senza titolo"}
              layout="fill"
              objectFit="cover" 
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full text-center text-white text-2xl p-4 bg-black bg-opacity-60">
            Il battito culturale della Sicilia 
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slideshow;
