import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faEnvelope,
  faUser,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/src/components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importa il CSS della libreria

// Definisce il tipo per il parametro dateString
const parseDate = (dateString: string): Date => {
  const parts = dateString.split("-"); // Dividi la stringa in parti [16, 09, 2024]
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Converte in formato Date (YYYY-MM-DD)
};

interface ModalTicketProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    data: Date | null; // Usa Date | null per la proprietà data
    eta: string;
    orario: string;
    email: string;
    numeroBiglietti: number;
  }) => Promise<void>;
  dateStart: string;
  dateEnd: string;
}

const ModalTicket: React.FC<ModalTicketProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dateStart,
  dateEnd,
}) => {
  const initialFormState = {
    data: null as Date | null, // Cambia a Date | null per supportare DatePicker e l'assegnazione di Date
    eta: "adulti",
    orario: "",
    email: "",
    numeroBiglietti: 1,
  };

  // Converti le date di inizio e fine in oggetti Date validi
  const minDate = parseDate(dateStart);
  const maxDate = parseDate(dateEnd);

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  // Se minDate e maxDate sono uguali, imposta la data automaticamente
  useEffect(() => {
    if (minDate.getTime() === maxDate.getTime()) {
      setFormData((prevState) => ({ ...prevState, data: minDate }));
    }
  }, [minDate, maxDate]);

  // Modifica handleChange per gestire Date | null
  const handleChange = (name: string, value: string | number | Date | null) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      toast.success("Prenotazione effettuata con successo!");
    } catch (error) {
      toast.error("Errore durante l'invio della prenotazione.");
    } finally {
      setIsLoading(false);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  // Funzione per disabilitare la chiusura cliccando all'esterno durante il caricamento
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (isLoading) return; // Ignora il clic se c'è il caricamento in corso
    if ((e.target as HTMLElement).className.includes("modal")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick} // Gestione del clic esterno
    >
      <div className="modal-content relative p-6 shadow-lg bg-white w-full max-w-md mx-auto" style={{ borderRadius: '0' }}>
        <h2 className="font-titolo text-2xl text-rosso mb-4">Prenota il ticket</h2>

        {isLoading ? (
          <Loading />
        ) : (
          <form className="flex flex-col space-y-4">
            {/* Se minDate e maxDate sono uguali, mostra solo la data come testo */}
            {minDate.getTime() === maxDate.getTime() ? (
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600" />
                <label className="flex-">Data:</label>
                <span className="flex-1 p-2 border">{dateStart}</span> {/* Mostra la data come testo */}

              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-600"
                />
                <label className="flex-1">Data:</label>
                <DatePicker
                  selected={formData.data}
                  onChange={(date: Date | null) => handleChange("data", date)} // Modifica per accettare Date | null
                  minDate={minDate}
                  maxDate={maxDate}
                  dateFormat="yyyy-MM-dd"
                  className="flex-1 p-2 border" 
                  placeholderText="Seleziona una data"
                  required
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="text-gray-600" />
              <label className="flex-1">Età:</label>
              <select
                name="eta"
                value={formData.eta}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="flex-1 p-2 border"
              >
                <option value="adulti" >Adulti</option>
                <option value="bimbi">Bimbi (5-10 anni)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-600" />
              <label className="flex-1">Orario:</label>
              <select
                name="orario"
                value={formData.orario}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="flex-1 p-2 border"
              >
                <option value="16">16:00</option>
                <option value="17">17:00</option>
                <option value="18">18:00</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />
              <label className="flex-1 ">Email per conferma:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
                className="flex-1 p-2 border"
              />
            </div>

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faTicketAlt} className="text-gray-600" />
              <label className="flex-1">Numero di biglietti:</label>
              <input
                type="number"
                name="numeroBiglietti"
                value={formData.numeroBiglietti}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                min="1"
                required
                className="flex-1 p-2 border"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
              disabled={isLoading}
            >
              Conferma Prenotazione
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalTicket;
