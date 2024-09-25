"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "../(models)/Event";
import Image from "next/image";

function Dashboard() {
  const [cards, setCards] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCards = async (): Promise<void> => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filtra le card con reviewed = false
      const filteredCards = data.events.filter(
        (event: IEvent) => event.reviewed === false
      );
      setCards(filteredCards);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (eventId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewed: true }),
      });

      if (!response.ok) {
        throw new Error(`Failed to publish event. Status: ${response.status}`);
      }

      // Rimuovi l'evento dalla lista una volta pubblicato
      setCards((prevCards) =>
        prevCards.filter((event) => String(event._id) !== String(eventId))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleRemove = async (eventId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to remove event. Status: ${response.status}`);
      }

      // Rimuovi l'evento dalla lista una volta rimosso
      setCards((prevCards) =>
        prevCards.filter((event) => String(event._id) !== String(eventId))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="hidden sm:table w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="pl-2 py-2 text-left">
              Immagine
            </th>
            <th scope="col" className="py-2 text-left">
              Titolo evento
            </th>
            <th scope="col" className="px-2 py-2 text-left">
              Data inizio
            </th>
            <th scope="col" className="px-2 py-2 text-left">
              Data fine
            </th>
            <th scope="col" className="pl-2 py-2 text-left">
              Location
            </th>
            <th scope="col" className="pl-2 py-2 text-left">
              Tag
            </th>
            <th scope="col" className="pl-2 py-2 text-left">
              Prezzo
            </th>
            <th scope="col" className="px-2 py-2 text-left">
              Azione
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((product: IEvent) => (
            <React.Fragment key={product._id}>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="p-2 text-left">
                  <div className="w-42 md:w-64 max-w-full max-h-full relative h-[150px]">
                    <Image
                      src={product.image || "/placeholder-image.png"}
                      alt={product.title || "immagine senza titolo"} // Testo alternativo
                      layout="fill"
                      objectFit="cover" // Simile a object-cover su <img />
                    />
                  </div>
                </td>
                {/* Limita la larghezza e forza il wrapping per il titolo evento */}
                <td className="py-2 font-semibold text-gray-900 text-left break-words max-w-xs">
                  {product.title}
                </td>
                <td className="py-2 text-left">{product.dateStart}</td>
                <td className="py-2 font-semibold text-gray-900 text-left">
                  {product.dateEnd}
                </td>
                {/* Limita la larghezza e forza il wrapping per la location */}
                <td className="px-2 py-2 text-left break-words max-w-xs">
                  {product.location}
                </td>
                <td className="px-2 py-2 text-left break-words max-w-xs">
                  {Array.isArray(product.tag) ? (
                    product.tag.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 text-gray-800 px-1 py-1 mr-1 break-words max-w-[5rem]"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span>{product.tag}</span>
                  )}
                </td>
                <td className="px-2 py-2 text-left">{product.price}</td>
                <td className="px-2 py-2 text-left">
                  <button
                    onClick={() => handlePublish(String(product._id))}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 mr-2"
                  >
                    Pubblica
                  </button>
                  <button
                    onClick={() => handleRemove(String(product._id))}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3"
                  >
                    Rimuovi
                  </button>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan={8} className="p-4">
                  <p className="text-gray-700 break-words whitespace-normal">
                    {product.description}
                  </p>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Layout per dispositivi mobili */}
      <div className="sm:hidden">
        {cards.map((product: IEvent) => (
          <div
            key={product._id}
            className="flex flex-col bg-white border mb-4 shadow-md p-4"
          >
            <div className="w-full mb-4 relative" style={{ height: "200px" }}>
              <Image
                src={product.image || "/placeholder-image.png"}
                alt={product.title || "immagine senza titolo"} // Testo alternativo
                layout="fill"
                objectFit="cover" // Simile a object-cover su <img />
                className="rounded-t-lg"
                priority={true}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words whitespace-normal">
              {product.title}
            </h3>
            <p className="text-gray-700 mb-2 break-words">
              Inizio: {product.dateStart}
            </p>
            <p className="text-gray-700 mb-2 break-words">
              Fine: {product.dateEnd}
            </p>
            <p className="text-gray-700 mb-2 break-words">
              Location: {product.location}
            </p>
            <div className="mb-2">
              {Array.isArray(product.tag) ? (
                product.tag.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 text-gray-800 px-2 py-1 m-1 break-words max-w-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span>{product.tag}</span>
              )}
            </div>
            <p className="text-gray-700 mb-4 break-words whitespace-normal">
              Prezzo: {product.price}
            </p>
            <div className="flex justify-start">
              <button
                onClick={() => handlePublish(String(product._id))}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 mr-2"
              >
                Pubblica
              </button>
              <button
                onClick={() => handleRemove(String(product._id))}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3"
              >
                Rimuovi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
