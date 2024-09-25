"use client";

import Card from "@/src/components/Card";
import React, { useCallback, useEffect, useState } from "react";
import { IEvent } from "../(models)/Event";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { getDayOfYear } from "@/data/getDayOfYear";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import Loading from "@/src/components/Loading";
import CategoryBanner from "@/src/components/CategoryBanner";
import { getAuth } from "firebase/auth";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";
import Button from "@/src/components/Button";

const fetchData = async (): Promise<{ events: IEvent[] }> => {
  try {
    const res = await fetch(`/api/events`, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
      throw Error(error.message);
    } else {
      throw Error("Unknown error occurred");
    }
  }
};

export default function AttivitaPage() {
  const [activities, setActivities] = useState<IEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFree, setIsFree] = useState<boolean>(false);
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(
    undefined
  );
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 12; // Numero di eventi da visualizzare inizialmente

  // Funzione per recuperare i preferiti dell'utente
  const fetchFavorites = async (email: string | null) => {
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const favoriteTitle = data.profile.events.map(
        (event: { title: string | undefined }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  };

  // Effetto per caricare i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchData();
        setActivities(data.events);
        setFilteredEvents(data.events);
        setLoading(false);
        // Recupera i preferiti se l'utente è autenticato
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userEmail = user.email;
          await fetchFavorites(userEmail);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage("Failed to load data.");
        }
      }
    };
    loadData();
  }, []);

  // Funzione per gestire la ricerca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, isFree, today);
  };

  // Filtra eventi di oggi
  const handleTodayClick = () => {
    const date = formattedDate();
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  // Filtra eventi di domani
  const handleTomorrowClick = () => {
    const date = formattedDate(1);
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  // Filtra eventi della prossima settimana
  const handleNextWeekClick = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7;
    const nextMonday = getDayOfYear(formattedDate()) + daysUntilNextMonday;
    const nextSunday = nextMonday + 6;
    setStartNextWeek(nextMonday);
    setEndNextWeek(nextSunday);
    applyFilters(searchQuery, isFree, 0, nextMonday, nextSunday);
  };
  const handleShowMore = () => {
    setShowAll(true);
    setVisibleEvents(filteredEvents); // Mostra tutti gli eventi
  };

  // Funzione per applicare i filtri agli eventi

  const applyFilters = useCallback(
    (
      query: string,
      isFree: boolean,
      dayOfYear: number,
      startNextWeek?: number,
      endNextWeek?: number
    ) => {
      let filtered = activities;
      filtered = filtered.filter(
        (event) =>
          Boolean(event.reviewed) === true || event.reviewed === undefined
      );
      filtered = filtered.filter((event) => event.color === "#F2B85A");

      // Filtro per la query di ricerca
      if (query !== "") {
        filtered = filtered.filter(
          (event) =>
            event.title?.toLowerCase().includes(query.toLowerCase()) ||
            event.location?.toLowerCase().includes(query.toLowerCase()) ||
            event.tag?.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            )
        );
      }

      // Filtro per eventi gratuiti
      if (isFree) {
        filtered = filtered.filter((event) => event.price === "0");
      } else {
        filtered = filtered.filter((event) => event.price !== "0");
      }

      // Filtro per il giorno specifico
      if (dayOfYear) {
        filtered = filtered.filter((event) => {
          const startEvent = event.dateStart
            ? getDayOfYear(event.dateStart)
            : -1;
          const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
          return dayOfYear >= startEvent && dayOfYear <= endEvent;
        });
      }

      // Filtro per la prossima settimana
      if (startNextWeek !== undefined && endNextWeek !== undefined) {
        filtered = filtered.filter((event) => {
          const startEvent = event.dateStart
            ? getDayOfYear(event.dateStart)
            : -1;
          const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
          return startEvent <= endNextWeek && endEvent >= startNextWeek;
        });
      }

      setFilteredEvents(filtered);
      setVisibleEvents(filtered.slice(0, ITEMS_PER_PAGE)); // Mostra solo i primi 12 eventi
    },
    [activities]
  );

  // Applica i filtri quando gli stati cambiano
  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [applyFilters, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setIsFree(false);
    setToday(0);
    setStartNextWeek(undefined);
    setEndNextWeek(undefined);
    const filtered = activities.filter((event) => event.color === "#F2B85A");
    setFilteredEvents(filtered);
    setVisibleEvents(filtered.slice(0, ITEMS_PER_PAGE)); // Reset eventi
  };

  return (
    <div className="flex flex-col  items-center min-h-screen bg-gray-100 relative">
      <CategoryBanner label="Attività" backgroundColor={"bg-giallo"} />

      <Filter
        query={searchQuery}
        onSearch={handleSearch}
        isFree={isFree}
        setIsFree={setIsFree}
        onTodayClick={handleTodayClick}
        onTomorrowClick={handleTomorrowClick}
        onNextWeekClick={handleNextWeekClick}
        onResetFilters={handleResetFilters}
      />

      <div className="card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 items-start mb-10">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {loading ? (
          <Loading />
        ) : filteredEvents.length > 0 ? (
          visibleEvents.map((activity, index) => (
            <div
              key={activity._id || index}
              className="col-span-1 w-full md:w-auto  justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow"
            >
              <Card
                dateEnd={activity.dateEnd}
                dateStart={activity.dateStart}
                eventId={activity._id}
                backgroundColor="#F2B85A"
                title={activity.title || "No title available"}
                imageSrc={activity.image || "default-image-url"}
                link={
                  <Link href={`/events/${activity._id}`}>
                    <ArrowButton />
                  </Link>
                }
                isLiked={
                  activity.title
                    ? favoriteEventTitle.includes(activity.title)
                    : false
                }
                onHeartClick={() =>
                  fetchFavorites(getAuth().currentUser?.email || "")
                }
              />
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center ">
            <p className="text-center text-gray-600 text-xl ">
              Nessun evento disponibile...
            </p>
          </div>
        )}
      </div>
      {!showAll && filteredEvents.length > ITEMS_PER_PAGE && (
        <Button
          label={"Vedi altro"}
          onClick={handleShowMore}
          className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold mb-20"
        ></Button>
      )}
      <ScrollToTopButton />
    </div>
  );
}
