"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseconfig"; // Assicurati di importare db
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import ArrowButton from "../../src/components/ArrowButton";
import Card from "@/src/components/Card";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

interface Card {
  id: number;
  title: string;
  image: string;
  color: string;
  dateEnd?: string | undefined;
  dateStart?: string | undefined;
}

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const [editMode, setEditMode] = useState(false); // Stato per la modalità di modifica
  const [newFirstName, setNewFirstName] = useState<string | null>(null);
  const [newLastName, setNewLastName] = useState<string | null>(null);
  const router = useRouter();
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Funzione per recuperare i preferiti dell'utente
  const fetchFavorites = useCallback(async (email: string | null) => {
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
      console.error("Errore nel recupero dei preferiti:", error);
    }
  }, []);

  // Funzione per recuperare le card
  const fetchCards = useCallback(async (email: string | null) => {
    try {
      if (email) {
        const response = await fetch(`/api/profiles?email=${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data.profile.events);
      } else {
        console.error("Email utente non trovata");
      }
    } catch (error) {
      console.error("Errore nel recupero delle card:", error);
    }
  }, []);

  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName);
        setUserLastName(userData.lastName);
        setNewFirstName(userData.firstName);
        setNewLastName(userData.lastName);
      } else {
        toast.error("No user data found!");
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };

  // Effetto per gestire l'autenticazione e il caricamento dei dati utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.uid);
        fetchCards(user.email);
        fetchFavorites(user.email); // Aggiungi qui la fetch dei preferiti
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router, fetchCards, fetchFavorites]);

  // Funzione per eliminare (disattivare) l'account
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { active: false }); // Imposta il campo active su false

        // Mostra un toast per informare l'utente che l'account è stato cancellato
        toast.success("Il tuo account è stato cancellato con successo.");

        // Effettua il logout
        await signOut(auth);
        toast.info("Logout effettuato con successo!");

        // Reindirizza alla homepage
        router.push("/");
      }
    } catch (error) {
      console.error("Errore durante la disattivazione dell'account:", error);
      toast.error(
        "Si è verificato un errore durante la disattivazione dell'account."
      );
    }
  };

  // Funzione per aggiornare le card dopo l'interazione
  const handleUpdate = useCallback(async () => {
    if (userEmail) {
      await fetchCards(userEmail); // Fetch cards after updating favorites
    }
  }, [userEmail, fetchCards]);

  // Funzione per aggiornare i dati utente
  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser;

      if (user && newFirstName && newLastName) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          firstName: newFirstName,
          lastName: newLastName,
        });

        // Aggiorna lo stato con i nuovi dati
        setUserName(newFirstName);
        setUserLastName(newLastName);

        // Triggera l'evento per aggiornare la navbar
        window.dispatchEvent(
          new CustomEvent("userNameUpdated", {
            detail: { newName: newFirstName },
          })
        );

        // Mostra un toast di successo
        toast.success("Dati aggiornati con successo!");

        // Esce dalla modalità di modifica
        setEditMode(false);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati:", error);
      toast.error(
        "Si è verificato un errore durante l'aggiornamento dei dati."
      );
    }
  };

  // Funzione per mostrare o nascondere l'accordion
  const toggleAccordion = () => {
    setShowAccordion(!showAccordion);
  };

  // Funzione per mostrare la modale di conferma
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <div className="flex flex-col  items-center min-h-screen bg-gray-100 relative">
      {/* Sezione di Benvenuto */}
      <div className="mt-8 text-center flex justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Ciao {userName} {userLastName}
        </h2>
        <button onClick={toggleAccordion} className="ml-2">
          {showAccordion ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#822225"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M6 15l6-6 6 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#822225"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </button>
      </div>

      {showAccordion && (
        <div className="mt-4 border-2 border-rosso p-4 bg-gray-100 text-gray-900 relative shadow-md max-w-lg mx-auto">
          <h3 className="font-titolo text-2xl text-rosso mb-4">
            Preferenze account
          </h3>
          <div className="mb-4">
            <h4 className="text-md font-titolo text-rosso">Dati Personali</h4>
            {editMode ? (
              <>
                <div className="mt-2">
                  <label className="font-semibold text-gray-700">Nome:</label>
                  <input
                    type="text"
                    value={newFirstName || ""}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="border rounded w-full p-2 mt-1"
                  />
                </div>
                <div className="mt-2">
                  <label className="font-semibold text-gray-700">
                    Cognome:
                  </label>
                  <input
                    type="text"
                    value={newLastName || ""}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="border rounded w-full p-2 mt-1"
                  />
                </div>
                <button
                  className="mt-4 bg-gradient-to-r from-green-500 to-green-700 text-white p-2 shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-800 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full"
                  onClick={handleSaveChanges}
                >
                  Salva modifiche
                </button>
                <button
                  className="mt-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white p-2 shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-800 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full"
                  onClick={() => setEditMode(false)}
                >
                  Annulla
                </button>
              </>
            ) : (
              <>
                <p className="mt-2">
                  <strong>Nome:</strong> {userName}
                </p>
                <p>
                  <strong>Cognome:</strong> {userLastName}
                </p>
                <p>
                  <strong>Email:</strong> {userEmail}
                </p>
                <button
                  className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full"
                  onClick={() => setEditMode(true)}
                >
                  Modifica dati
                </button>
              </>
            )}
          </div>
          <button
            className="bg-gradient-to-r from-red-500 to-red-700 text-white p-2 shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-800 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full"
            onClick={toggleDeleteModal}
          >
            Elimina account
          </button>
        </div>
      )}

      {/* Pulsanti */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-center space-x-0 space-y-4 md:space-y-0 md:space-x-4">
        <Link href="/propose">
          <button className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold transition-colors duration-300 w-full md:w-auto">
            Proponi evento
          </button>
        </Link>
      </div>
      <h3 className="mt-8 mb-8 text-3xl font-titolo text-rosso">
        Eventi Preferiti
      </h3>
      {/* Cards */}
      <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-start  mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="col-span-1 transform hover:scale-105 transition-transform duration-300 custom-shadow" // Mantieni 'flex justify-center' qui
          >
            <Card
              eventId={card.id}
              key={card.title} // Usa il titolo come chiave univoca
              backgroundColor={card.color}
              title={card.title || "No title available"}
              imageSrc={card.image || "default-image-url"}
              link={
                <Link href={`/events/${card.id}`}>
                  <ArrowButton />
                </Link>
              }
              dateStart={card.dateStart}
              dateEnd={card.dateEnd}
              isLiked={favoriteEventTitle.includes(card.title)} // Usa il titolo per controllare se è piaciuto
              onHeartClick={async () => {
                await fetchFavorites(getAuth().currentUser?.email || ""); // Ricarica i preferiti dopo il click
                handleUpdate(); // Aggiorna anche le card
              }}
            />
          </div>
        ))}
      </div>
      {/* Modale di conferma eliminazione account */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 shadow-lg max-w-md mx-auto">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Conferma eliminazione
            </h3>
            <p className="text-gray-700 mb-6">
              Sei sicuro di voler eliminare il tuo account? Questa operazione è
              irreversibile.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                onClick={toggleDeleteModal} // Chiudi la modale
              >
                Annulla
              </button>
              <button
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                onClick={handleDeleteAccount} // Esegui l'eliminazione dell'account
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
