import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

interface HeartButtonProps {
  eventId?: number;
  title: string | undefined;
  image: string | undefined;
  color: string;
  isLiked?: boolean | false;
  onClick?: () => void; // Callback per aggiornare le card nella pagina principale
}

const HeartButton: React.FC<HeartButtonProps> = ({ eventId, color, title, image, isLiked, onClick }) => {
  const [liked, setLiked] = useState<boolean>(isLiked || false); // Stato per la gestione del cuoricino

  useEffect(() => {
    setLiked(isLiked || false);
  }, [isLiked]);

  // Gestione del click sul cuoricino
  const handleFavoriteClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Devi effettuare il login per aggiungere ai preferiti.");
      return;
    }
    const userEmail = user.email;

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: userEmail,
          events: [
            {
              id: eventId,
              title: title,
              image: image,
              color,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setLiked(!liked);

        // Notifica ProfilePage per aggiornare le card
        if (onClick) {
          onClick();
        }
      } else {
        alert("Errore nell'aggiungere ai preferiti.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-1 transition-transform duration-200 ${liked ? 'scale-125' : 'scale-100'}`} // Aggiunge l'animazione di scaling
      style={{
        backgroundColor: color,
        marginTop: -10,
      }}
      title="Heart Button"
    >
      <svg
        onClick={handleFavoriteClick}
        className={`w-6 h-6 transition-colors duration-300 ${liked ? 'text-[#8D3639]' : 'text-white'}`} // Cambia il colore tra rosso e grigio
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default HeartButton;
