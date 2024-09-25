"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { db } from "@/firebaseconfig"; // Importa db per Firestore
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importa getDoc da Firestore
import LoginButton from "./Login";
import { toast } from "react-toastify";

interface NavLink {
  name: string;
  href: string;
}

interface NavBarProps {
  links?: NavLink[];
}

const NavBar = ({ links = [] }: NavBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(links[0]?.name);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Stato per nome utente
  const router = useRouter(); // Initialize useRouter

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchUserRole = async (email: string | null) => {
    if (!email) return; // Se l'email non è disponibile, non fare nulla
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const role = data.profile?.role; // Assumi che il ruolo sia in data.profile.role
      return role;
    } catch (error) {
      console.error("Errore nel recupero del ruolo:", error);
    }
  };

  const auth = getAuth();
  const user = auth.currentUser;

  const idAdminRole = useCallback(async () => {
    if (user) {
      const role = await fetchUserRole(user.email);
      if (role === "admin") {
        setIsAdmin(true); // Se il ruolo è admin, imposta lo stato isAdmin a true
      }
    }
  }, [user]);

  useEffect(() => {
    idAdminRole();
  }, [user, idAdminRole]);

  const pathname = usePathname();
  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName); // Imposta il nome
      } else {
        toast.error("Impossibile recuperare i dati utente");
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };

  useEffect(() => {
    // Se sei su /profile, non selezionare nessun elemento
    if (pathname === "/profile" || pathname === "/signup") {
      setActiveItem(null);
    } else {
      // Controlla se l'item corrente è già attivo prima di aggiornarlo
      if (activeItem !== links.find((link) => link.href === pathname)?.name) {
        const currentLink = links.find((link) => link.href === pathname);
        if (currentLink) {
          setActiveItem(currentLink.name);
        }
      }
    }
  }, [pathname, activeItem, links]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.uid); // Richiama la funzione per recuperare nome e cognome
        setActiveItem(links[0]?.name);
      } else {
        setUserEmail(null);
        setUserName(null);
        setActiveItem(links[0]?.name);
      }
    });

    return () => unsubscribe();
  }, [router, links, auth]);

  // Funzione che ascolta l'evento e aggiorna lo stato
  useEffect(() => {
    // Listener per l'evento personalizzato
    const updateUserName = (event: Event) => {
      // Esegui il cast di 'event' a 'CustomEvent'
      const customEvent = event as CustomEvent<{ newName: string }>;
      setUserName(customEvent.detail.newName);
    };

    window.addEventListener("userNameUpdated", updateUserName as EventListener);

    return () => {
      window.removeEventListener(
        "userNameUpdated",
        updateUserName as EventListener
      );
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginSuccess = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUserEmail(null);
      setUserName(null);
      setActiveItem(links[0]?.name); // Reset the active item to "Home" after logging out
      router.push("/"); // Redirect to Home after logout
      toast.success("Logout effettuato con successo!");

      // Imposta un timeout di 2 secondi (2000 millisecondi) prima del ricaricamento
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 millisecondi = 2 secondi
    });
  };
  const menuRef = useRef<HTMLDivElement | null>(null); // Specifica che sarà un elemento HTMLDivElement o null
  const buttonRef = useRef<HTMLButtonElement | null>(null); //  Riferimento all'icona dell'hamburger
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Chiudi il menu
      }
    };

    const handleScroll = () => {
      setIsOpen(false); // Chiudi il menu quando l'utente scorre
    };

    // Aggiungi listener per il click esterno e lo scroll
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    // Pulizia dei listener quando il componente viene smontato
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuRef, buttonRef]);

  const [navbarHeight, setNavbarHeight] = useState(0);

  const navbarRef = useRef<HTMLDivElement>(null);

  // Funzione per ottenere l'altezza della navbar dinamicamente
  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
        console.log("altezza", navbarRef.current.offsetHeight);
      }
    };

    // Calcola l'altezza della navbar all'inizio
    updateNavbarHeight();

    // Aggiorna l'altezza della navbar se la finestra viene ridimensionata
    window.addEventListener("resize", updateNavbarHeight);

    // Cleanup per rimuovere l'event listener
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <header
      className="relative bg-bianco p-4 whitespace-nowrap mr-2"
      ref={navbarRef}
    >
      <div className="hidden md:flex gap-5 items-center  ">
        {links.map((link) => {
          if (link.name === "Pannello di controllo" && !isAdmin) {
            return null; // Non mostrare il link se non è un admin
          }
          if (link.name === "Proponi Evento") {
            // Se l'utente è autenticato, mostra il link normalmente
            if (userEmail) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleClick(link.name)}
                  className={`text-verde hover:text-verde hover:font-bold whitespace-nowrap ${
                    activeItem === link.name ? "font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            } else {
              // Se l'utente non è autenticato, mostra il componente LoginButton
              return (
                <LoginButton
                  key={`login-${link.name}`}
                  buttonLabel="Proponi evento"
                  redirectTo="/propose"
                  onLoginSuccess={() => handleLoginSuccess(links[4]?.name)}
                  buttonClassName="text-verde hover:text-verde hover:font-bold whitespace-nowrap"
                />
              );
            }
          }

          // Rendi normalmente gli altri link
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => handleClick(link.name)}
              className={`text-verde hover:text-verde hover:font-bold ${
                activeItem === link.name ? "font-bold" : ""
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {userName ? (
          <>
            <Link href="/profile">
              <div className="flex items-center justify-center w-8 h-8 bg-verde text-white rounded-full cursor-pointer">
                {userName.charAt(0).toUpperCase()}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-rosso ml-2">
              ESCI
            </button>
          </>
        ) : (
          <LoginButton />
        )}
      </div>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center ">
        <button onClick={toggleMenu} className="text-verde focus:outline-none">
          <svg
            className={`position mr-0 mt-0 w-10 h-10 transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        ref={menuRef}
        className={`fixed right-0 w-full h-90 bg-bianco z-50 transform transition-transform duration-300  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: ` ${navbarHeight + 38}px ` }} // Imposta dinamicamente il top in base all'altezza della navbar
      >
        <button
          ref={buttonRef}
          className={`p-4 text-verde focus:outline-none absolute top-4 right-4 ${
            isOpen ? "hidden" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </button>
        <div className="  flex flex-col items-center space-y-4 p-6 text-center h-auto">
          {/* Cambia h-full a h-auto */}
          {links.map((link) => {
            if (link.name === "Pannello di controllo" && !isAdmin) {
              return null; // Non mostrare il link se non è un admin
            }
            if (link.name === "Proponi Evento") {
              if (userEmail) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => handleClick(link.name)}
                    className={`block text-verde hover:text-verde hover:font-bold ${
                      activeItem === link.name ? "font-bold" : "font-normal"
                    } py-2`}
                  >
                    {link.name}
                  </Link>
                );
              } else {
                return (
                  <LoginButton
                    key={`login-${link.name}`}
                    buttonLabel="Proponi evento"
                    redirectTo="/propose"
                    onLoginSuccess={() => handleLoginSuccess(links[4]?.name)}
                    buttonClassName="text-verde hover:text-verde hover:font-bold"
                  />
                );
              }
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleClick(link.name)}
                className={`text-verde hover:text-verde hover:font-bold ${
                  activeItem === link.name ? "font-bold" : ""
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {userName ? (
            <>
              <Link href="/profile">
                <div className="flex items-center justify-center w-8 h-8 bg-verde text-white rounded-full cursor-pointer">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="text-rosso ml-2">
                ESCI
              </button>
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
