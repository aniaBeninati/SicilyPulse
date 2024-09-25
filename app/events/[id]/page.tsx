"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "../../../src/components/Loading";
import ModalTicket from "@/src/components/ModalTicket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Event {
  _id: string;
  title?: string;
  image?: string;
  tag?: string[];
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  price?: string;
  location?: string;
  color: string;
  article?: string;
  arrayImageArticle?: string[];
}

interface Section {
  subtitle: string;
  content: string;
}

interface Article {
  title: string;
  introduction: string;
  sections: Section[];
  thesis?: string;       // Se non sono sempre presenti, usali come optional
  conclusion?: string;  // Se non sono sempre presenti, usali come optional
}

function parseArticles(input: string, setArticle: Dispatch<SetStateAction<Article[]>>): void {
  const articles = input.split(/## Articolo \d+: /).filter(Boolean);

  const parsedArticles = articles.map(article => {
    const jsonMatch = article.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return null;

    try {
      const jsonContent = JSON.parse(jsonMatch[1].trim());

      return {
        title: jsonContent.title,
        introduction: jsonContent.introduction,
        sections: jsonContent.sections.map((section: { subtitle: string; content: string }) => ({
          subtitle: section.subtitle,
          content: section.content
        })),
        thesis: jsonContent.thesis || '', // Gestisci il campo thesis come optional
        conclusion: jsonContent.conclusion || '' // Gestisci il campo conclusion come optional
      };
    } catch (error) {
      console.error("Errore nel parsing del JSON:", error);
      return null;
    }
  }).filter(Boolean) as Article[];

  setArticle(parsedArticles); // Imposta direttamente lo stato
}


const getData = async (id: string) => {
  try {
    const res = await fetch(`/api/events/${id}`, {
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
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [article, setArticle] = useState<Article[]>([]);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const fetchedEvent = await getData(id);
        setEvent(fetchedEvent);
        if (fetchedEvent?.article) {
          parseArticles(fetchedEvent.article, setArticle); // Chiamata a formatArticle
        }

      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Errore sconosciuto");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Funzione per gestire l'invio della modale
  const handleModalSubmit = async (formData: {
    data: Date | null;
    eta: string;
    orario: string;
    email: string;
    numeroBiglietti: number;
  }) => {
    // Converti la data in formato stringa se non è nulla
    const formattedData = {
      ...formData,
      data: formData.data ? formData.data.toISOString().split("T")[0] : "", // Converte la data in formato YYYY-MM-DD
    };

    try {
      const response = await fetch("/api/send-email", {
        // Chiama il tuo endpoint API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData), // Usa il formData formattato
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio dell'email");
      }

      toast.success("Email inviata con successo!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Errore durante l'invio dell'email: ${error.message}`);
      } else {
        toast.error("Errore sconosciuto durante l'invio dell'email.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
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

      {event ? (
        <div
          className="w-full py-4 mb-4"
          style={{ backgroundColor: event.color }}
        >
          <div className="max-w-5xl mx-auto px-5">
            <h1 className="text-white text-4xl font-titolo text-left leading-[50px] ">
              {event.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className="w-full py-4 mb-4">
          <p>Evento non trovato.</p>
        </div>
      )}

      <div className="p-5 max-w-5xl mx-auto text-black">
        <div className="mt-4">
          {event?.tag && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>
              {event?.tag?.join(", ")}
            </p>
          )}
          {event?.dateStart && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">
                Data inizio:
              </strong>
              {event?.dateStart}
            </p>
          )}
          {event?.dateEnd && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">
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
              {event?.price === "0" ? "Ingresso gratuito" : `${event.price}€`}
            </p>
          )}
          {event?.location && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>
              {event?.location}
            </p>
          )}
        </div>

        <p className="mt-6">{event?.description}</p>

        {article.map((item, index) => (
          <div className="mb-4" key={index}>
            <h2 className="text-3xl font-titolo mt-8 mb-4  text-rosso">{item.title}</h2>
            <p>{item.introduction}</p> {/* Mostra l'introduzione dell'articolo */}

            {item.sections.map((sub, subIndex) => (
              <div key={subIndex} className="">
                <h3 className="mt-4 mb-2 text-xl font-medium font-text  text-black text-left">{sub.subtitle}</h3>
                <p>{sub.content}</p> {/* Mostra il contenuto associato al sottotitolo */}
              </div>
            ))}
            {item.thesis && (
              <>
                <p className="my-4">{item.thesis}</p>
              </>
            )}
            {item.conclusion && (
              <>
                <p className="my-4">{item.conclusion}</p>
              </>
            )}
          </div>
        ))}


        <button
          className="border-2 p-2 font-bold transition-colors duration-300 w-full md:w-auto mt-4"
          style={{
            borderColor: event?.color || "black",
            color: event?.color || "black",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = event?.color || "black";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = event?.color || "black";
          }}
          onClick={goBack}
        >
          Torna indietro
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-5">
        <button
          onClick={() => setModalOpen(true)}
          className="mb-10 bg-rosso text-white px-4 py-2 border-2 border-rosso font-bold transition-colors duration-300 w-full md:w-auto"
        >
          <span role="img" aria-label="ticket">
            🎟
          </span>{" "}
          Prenota il ticket
        </button>
      </div>

      {/* Modale per l'acquisto del ticket */}
      <ModalTicket
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        dateStart={event?.dateStart || ""} // Fallback a stringa vuota
        dateEnd={event?.dateEnd || ""} // Fallback a stringa vuota
      />
      <ToastContainer containerId="toastEventDetail" />
    </div>
  );
};

export default EventDetailPage;
