"use client";

import React from "react";
import ArrowButton from "./ArrowButton";
import HeartButton from "./HeartButton";
import { truncateText } from "@/data/troncateText";
import Link from "next/link";
import Image from "next/image";

interface CardProps {
  backgroundColor: string;
  title: string | undefined;
  imageSrc: string | undefined;
  size?: "small" | "large";
  link?: React.ReactNode;
  eventId: number; // Passa l'ID dell'evento come prop
  onHeartClick?: () => void;
  isLiked?: boolean; // Nuova prop per gestire lo stato del cuoricino
  dateEnd?: string | undefined;
  dateStart?: string | undefined;
  //price?: string | undefined;
  description?: string | undefined;
}

const truncateDescription = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

/* cooment */
const Card: React.FC<CardProps> = ({
  backgroundColor,
  title,
  imageSrc,
  size = "small",
  link,
  eventId,
  isLiked = false,
  onHeartClick,
  dateEnd,
  dateStart,
  //price,
  description,
}) => {
  const sizeClasses =
    size === "large" ? " h-[400px] w-[1025px]" : "max-w-xs h-[180px]";
  const dynamicBackgroundColor =
    eventId === 1
      ? "#FFD700" // Usa il colore oro per l'id 1
      : backgroundColor;

  return (
    <div
      className={`overflow-hidden shadow-lg relative ${sizeClasses}`}
      style={{ backgroundColor: dynamicBackgroundColor, minHeight: "300px" }} // Imposta una min-height per garantire spazio
    >
      {size === "large" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Sezione Immagine per Card Grande */}
          <div className="relative flex items-center overflow-hidden">
            <div className="flex items-center overflow-hidden h-[300px]">
              <Image
                src={imageSrc || "/placeholder-image.png"}
                alt={title || "immagine senza titolo"} // Testo alternativo
                layout="fill"
                objectFit="cover" // Simile a object-cover su <img />
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <HeartButton
                onClick={onHeartClick}
                title={title}
                image={imageSrc}
                eventId={eventId}
                color={backgroundColor}
                isLiked={isLiked}
              />
            </div>
          </div>

          <Link href={`/events/${eventId}`}>
            <div className="flex flex-row justify-between cursor-pointer">
              <div
                className=" p-6 flex flex-col justify-between  text-white relative mt-10"
                style={{ backgroundColor }}
              >
                <h2 className="text-[20px] font-titolo underline-on-hover">
                  {title ? truncateText(title, 10) : "No title"}
                </h2>
                <p className="text-[14px] font-sans mt-8 mb-8">
                  {description
                    ? truncateDescription(description, 60)
                    : "No description"}
                </p>
                <div className="text-[12px] font-sans mt-2 flex flex-wrap items-center relative">
                  <span className="mr-2">
                    {dateStart ? `Dal ${dateStart}` : ""}
                  </span>
                  <span className="mr-2">{dateEnd ? `Al ${dateEnd}` : ""}</span>
                  {/* {price ? (
                  <div className="price-circle ml-auto absolute bottom-1.5  right-2">
                    {`${price} €`}
                  </div>
                ) : (
                  <span className="ml-auto">Prezzo non disponibile</span>
                )} */}
                </div>
                <div className="absolute bottom-4 right-4 cursor-pointer">
                  <ArrowButton />
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        // Layout per card piccole
        <div>
          <div className="relative">
            <div className="clip-path-bottom">
              <div className={`object-cover w-full ${sizeClasses}`}>
                <Image
                  src={imageSrc || "/placeholder-image.png"}
                  alt={title || "immagine senza titolo"} // Testo alternativo
                  layout="fill"
                  objectFit="cover" // Simile a object-cover su <img />
                />
              </div>

              <div className="absolute top-2 right-2 flex space-x-2">
                <HeartButton
                  onClick={onHeartClick}
                  title={title}
                  image={imageSrc}
                  eventId={eventId} // Passa l'ID dell'evento a HeartButton
                  color={backgroundColor}
                  isLiked={isLiked} // Passa lo stato del
                />
              </div>
            </div>
          </div>
          <Link href={`/events/${eventId}`}>
            <div
              className="diagonal-line-container p-3 text-white relative"
              style={{ backgroundColor }}
            >
              <div className="diagonal-line-top"></div>
              <h2 className="h-[50px] text-[16px] font-titolo mt-4">
                {title ? truncateText(title, 10) : "No title"}
              </h2>
              <div className="text-[12px] font-sans mt-2 flex flex-wrap items-center relative ">
                <span className="mr-2">
                  {dateStart ? `Dal ${dateStart}` : ""}
                </span>
                <span className="mr-2">{dateEnd ? `Al ${dateEnd}` : ""}</span>
                {/* {price ? (
              <div className="price-circle ml-auto absolute bottom-1.5  right-2">
                {`${price} €`}
              </div>
            ) : (
              <span className="ml-auto">Prezzo non disponibile</span>
            )} */}
              </div>
              <div className="absolute bottom-2 right-2 cursor-pointer">
                {link ? (
                  link // Se il Link è passato come prop, renderizzalo
                ) : (
                  <div>
                    <ArrowButton />
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
