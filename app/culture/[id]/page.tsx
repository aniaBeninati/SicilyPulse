"use client";

import React, { useEffect, useState } from "react";
import Loading from "../../../src/components/Loading"; // Importa il componente di loading
import { IEvent } from "@/app/(models)/Event";
import Image from "next/image";

const getData = async (id: string) => {
  try {
    const res = await fetch(`/api/cultures/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(
        `Errore nella richiesta: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data.event;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "Errore sconosciuto durante il fetch dei dati"
      );
    } else {
      throw new Error("Errore sconosciuto durante il fetch dei dati");
    }
  }
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Stato per il caricamento
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const fetchedEvent = await getData(id);
        setEvent(fetchedEvent);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Errore sconosciuto");
        }
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <Loading />; // Mostra l'animazione di caricamento durante il fetching
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>; // Mostra l'errore se presente
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Immagine dell'evento */}
      {event?.image && (
        <div className="relative w-full h-[60vh]">
          {" "}
          {/* Aggiungi relative qui */}
          <Image
            src={event.image || "/placeholder-image.png"}
            alt={event.title || "immagine senza titolo"} // Testo alternativo
            layout="fill" // Riempi il contenitore
            objectFit="cover" // Mantenere l'effetto cover
            priority={true} // Aggiungi priority se è importante per il caricamento rapido
          />
        </div>
      )}

      {/* Rettangolo rosso con titolo */}
      <div className="bg-verde w-full py-4 mb-4">
        <div className="max-w-5xl mx-auto px-5 p-3">
          <h1 className="text-white text-4xl font-titolo font-bold text-left">
            {event?.title}
          </h1>
        </div>
      </div>

      {/* Dettagli dell'evento */}
      <div className="p-5 max-w-5xl mx-auto text-black">
        {/* Altri dettagli */}
        <div className="mt">
          {event?.tag && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>
              {event.tag.join(", ")}
            </p>
          )}
          {event?.dateStart && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data inizio:
              </strong>
              {event.dateStart}
            </p>
          )}
          {event?.dateEnd && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data fine:
              </strong>
              {event?.dateEnd}
            </p>
          )}
          {event?.price && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Prezzo:{" "}
              </strong>
              {event.price === "0" ? "Ingresso gratuito" : ` ${event.price}€`}
            </p>
          )}
          {event?.location && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>
              {event.location}
            </p>
          )}
        </div>

        {/* Descrizione dell'evento */}
        <p className="mt-6">{event?.description}</p>
      </div>
    </div>
  );
};

export default EventDetailPage;
