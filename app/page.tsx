"use client";
import { getDayOfYear } from "@/data/getDayOfYear";
import { useCallback, useEffect, useState } from "react";
import Card from "@/src/components/Card";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";
import { IEvent } from "./(models)/Event";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "@/src/components/Loading";
import Slideshow from "@/src/components/Slideshow";
import { User } from "firebase/auth";
import Button from "@/src/components/Button";

const fetchEvents = async () => {
  try {
    const res = await fetch(`/api/events`, {
      cache: "no-cache",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error(
      "Error fetching data:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    throw error;
  }
};

const getRandomSlides = (items: IEvent[], count: number): IEvent[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
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
  const [user, setUser] = useState<User | null>(null);
  const [slideshowImages, setSlideshowImages] = useState<
    { src: string; title: string }[]
  >([]);
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 12;

  const fetchFavorites = async (email: string | null) => {
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const favoriteTitle = data.profile.events.map(
        (event: { title: string }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    const reviewedEvents = events.filter(
      (event) => event.reviewed === true /* || event.reviewed === undefined */
    );

    // Prendo eventi casuali tra quelli che sono stati filtrati
    const randomSlides = getRandomSlides(reviewedEvents, 5);

    // Estraggo le immagini e i titoli dagli eventi filtrati
    const images = randomSlides.map((event) => ({
      src:
        event.image || "https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg",
      title: event.title || "Default Title",
    }));

    setSlideshowImages(images);
  }, [events]);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      console.log(user);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents();
        setEvents(data.events);
        setFilteredEvents(data.events);
        setLoading(false);

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          await fetchFavorites(user.email);
        }
      } catch (error) {
        setErrorMessage("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const randomSlides = getRandomSlides(events, 5);
  //   const images = randomSlides.map((event) => ({
  //     src:
  //       event.image || "https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg",
  //     title: event.title || "Default Title",
  //   }));
  //   setSlideshowImages(images);
  // }, [events]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, isFree, today);
  };

  const handleTodayClick = () => {
    const date = formattedDate();
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  const handleTomorrowClick = () => {
    const date = formattedDate(1);
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

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

  const applyFilters = useCallback(
    (
      query: string,
      isFree: boolean,
      dayOfYear: number,
      startNextWeek?: number,
      endNextWeek?: number
    ) => {
      let filtered = events;

      filtered = filtered.filter(
        (event) =>
          Boolean(event.reviewed) === true || event.reviewed === undefined
      );

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

      if (isFree) {
        filtered = filtered.filter((event) => event.price === "0");
      }

      if (dayOfYear) {
        filtered = filtered.filter((event) => {
          const startEvent = event.dateStart
            ? getDayOfYear(event.dateStart)
            : -1;
          const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;

          return dayOfYear >= startEvent && dayOfYear <= endEvent;
        });
      }

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
    [events]
  );

  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [applyFilters, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setIsFree(false);
    setToday(0);
    setStartNextWeek(undefined);
    setEndNextWeek(undefined);
    setFilteredEvents(filteredEvents);
    setVisibleEvents(filteredEvents.slice(0, ITEMS_PER_PAGE)); // Reset eventi
  };

  const handleShowMore = () => {
    setVisibleEvents((prevVisibleEvents) => [
      ...prevVisibleEvents,
      ...filteredEvents.slice(
        prevVisibleEvents.length,
        prevVisibleEvents.length + ITEMS_PER_PAGE
      ),
    ]);
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative text-verde">
      <Slideshow images={slideshowImages} />
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

      <main className="flex flex-col items-center justify-center flex-grow space-y-4 text-verde">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {loading ? (
          <Loading />
        ) : (
          <div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 items-start w-full mb-20 mt-10">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event, index) => {
                const isFourthCard = (index + 1) % 4 === 0;

                return (
                  <div
                    key={event._id || index}
                    className={`w-full md:w-auto justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow ${isFourthCard ? "lg:col-span-3 lg:flex" : "col-span-1"
                      }`}
                  >
                    <Card
                      isLiked={favoriteEventTitle.includes(event.title ?? "")}
                      eventId={event._id}
                      dateEnd={event.dateEnd}
                      dateStart={event.dateStart}
                      description={event.description}
                      backgroundColor={event.color || "#4E614E"}
                      title={event.title || "Default Title"}
                      imageSrc={
                        event.image ||
                        "https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
                      }
                      size={
                        isFourthCard && window.innerWidth >= 1025
                          ? "large"
                          : "small"
                      }
                      link={
                        <Link href={`/events/${event._id}`}>
                          <ArrowButton />
                        </Link>
                      }
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center ">
                <p className="text-center text-gray-600 text-xl ">
                  Nessun evento disponibile...
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      {visibleEvents.length < filteredEvents.length && (
        <Button
          label={"Vedi altro"}
          onClick={handleShowMore}
          className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold mb-20"
        />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
