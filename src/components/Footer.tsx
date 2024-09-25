import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative">
      <div className="w-full border border-rosso"></div>

      <div className="w-full bg-white py-6">
        <div className="flex justify-center">
          <Image
            src="/siclipulse-02.svg"
            alt="SiciliPulse Logo"
            width={200}
            height={50}
            className="my-4"
          />
        </div>
      </div>

      <div className="w-full border-b-4 border-rosso"></div>

      {/* Sezione contenente testo e icone */}
      <div className="bg-giallo w-full py-4 flex flex-col sm:flex-row justify-between items-center px-4">
        {/* Testo del copyright */}
        <p className="text-gray-700 mb-4 sm:mb-0">
          ©2024 SicilyPulse | Tutti i diritti sono riservati
        </p>

        {/* Sezione delle icone dei social media */}
        <div className="flex space-x-4">
          {/* Icona Instagram */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/instagram.svg"
              alt="Instagram Icon"
              width={30}
              height={30}
              className="cursor-pointer"
              style={{
                filter:
                  "invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)",
              }}
            />
          </a>

          {/* Icona Facebook */}
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/fb.svg"
              alt="Facebook Icon"
              width={30}
              height={30}
              className="cursor-pointer"
              style={{
                filter:
                  "invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)",
              }}
            />
          </a>

          {/* Icona YouTube */}
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/youtube.svg"
              alt="YouTube Icon"
              width={30}
              height={30}
              className="cursor-pointer"
              style={{
                filter:
                  "invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)",
              }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
