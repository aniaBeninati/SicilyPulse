"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import Button from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginButtonProps {
  buttonLabel?: string;
  buttonClassName?: string;
  redirectTo?: string;
  onLoginSuccess?: () => void; // Aggiungi il tipo esplicito
}

const LoginButton: React.FC<LoginButtonProps> = ({
  buttonLabel = "ACCEDI",
  buttonClassName = "text-rosso hover:font-bold",
  redirectTo = "/", // Valore di default per il redirect dopo il login
  onLoginSuccess, // Aggiungi questa nuova props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Inizializza useRouter per gestire la navigazione

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Effettua il login con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Recupera i dati utente da Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Verifica se l'utente è attivo
        if (!userData.active) {
          // Effettua il logout immediatamente se l'account è disattivato
          await signOut(auth);
          setLoading(false);
          toast.error("Il tuo account è disattivato. Contatta il supporto.", {
            className: "custom-toast-error",
          });
          return; // Blocca il proseguimento del login
        }

        // Se l'utente è attivo, consenti l'accesso e mostra un toast di successo
        setIsModalOpen(false);
        toast.success("Login effettuato con successo!", {
          className: "custom-toast-success",
        });

        if (onLoginSuccess) { // Chiama la funzione se è definita
          onLoginSuccess(); // Esegui onLoginSuccess
        }

        router.push(redirectTo); // Effettua il redirect alla pagina specificata
      } else {
        setLoading(false);
        toast.error("Utente non trovato.", {
          className: "custom-toast-error",
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Errore di accesso, riprova.", {
        className: "custom-toast-error",
      });
    }
  };

  const handleLogout = () => {
    signOut(auth);
    toast.success("Logout effettuato con successo!", {
      className: "bg-green-500 text-white p-2 rounded-lg",
    });
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Button
        label={isLoggedIn ? "LOGOUT" : buttonLabel}
        onClick={isLoggedIn ? handleLogout : openModal}
        className={isLoggedIn ? "text-rosso hover:font-bold" : buttonClassName}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full relative rounded-none">
            <h2 className="font-titolo text-2xl text-rosso mb-4">
              Fai il login
            </h2>
            <p className="mb-4">Inserisci le tue credenziali per accedere.</p>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-rosso font-bold text-xl"
            >
              &times;
            </button>

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 focus:ring-2 text-gray-600 focus:ring-verde"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 focus:ring-2 text-gray-600 focus:ring-verde"
              />
              <button
                type="submit"
                className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
              >
                Login
              </button>
            </form>

            <div className="mt-4 w-full m-0 p-0">
              <p className="text-gray-400">
                Non sei ancora registrato?{" "}
                <a
                  href="/signup"
                  className="text-rosso font-bold hover:underline"
                >
                  Registrati
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
