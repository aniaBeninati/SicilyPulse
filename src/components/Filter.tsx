import React, { Dispatch, SetStateAction, useState } from "react";
import Search from "./Search";
import SwitchBox from "./SwitchBox";
import Button from "./Button";

interface IFilter {
  query: string;
  onSearch: (query: string) => void;
  isFree: boolean;
  setIsFree: Dispatch<SetStateAction<boolean>>;
  onTodayClick: () => void;
  onTomorrowClick: () => void;
  onNextWeekClick: () => void;
  onResetFilters: () => void;
}

function Filter({
  query,
  onSearch,
  isFree,
  setIsFree,
  onTodayClick,
  onTomorrowClick,
  onNextWeekClick,
  onResetFilters,
}: IFilter) {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleReset = () => {
    onSearch(""); // Resetta il campo di ricerca
    setIsFree(false); // Resetta il filtro "Gratis"
    setActiveButton(null); // Resetta i pulsanti attivi
    onResetFilters(); // Chiama la funzione di reset per i filtri temporali
  };

  const toggleButton = (button: string, onClick: () => void) => {
    if (activeButton === button) {
      setActiveButton(null); // Disattiva il pulsante se è già attivo
    } else {
      setActiveButton(button); // Attiva il nuovo pulsante
      onClick();
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center gap-4 p-4 lg:px-20 mb-10 mt-10">
      <div className="w-full flex flex-col gap-4 items-center justify-center lg:flex-row lg:gap-2">
        {/* Campo di ricerca */}
        <div className="w-full lg:w-2/2"> {/* Allargato */}
          <Search
            query={query}
            onSearch={onSearch}
            onReset={() => onSearch("")}
          />
        </div>

        {/* Pulsanti e SwitchBox per tablet e desktop */}
        <div className="flex flex-col md:flex-row gap-2 w-full justify-between items-center whitespace-nowrap">
          <Button
            label={"Oggi"}
            onClick={() => toggleButton("oggi", onTodayClick)}
            className={`w-full lg:w-auto px-3 py-2 border-2 ${
              activeButton === "oggi"
                ? "bg-rosso text-white"
                : "border-rosso text-rosso bg-white hover:bg-rosso hover:text-white"
            } font-bold transition-colors duration-300 border-rosso`}
          />
          <Button
            label={"Domani"}
            onClick={() => toggleButton("domani", onTomorrowClick)}
            className={`w-full lg:w-auto px-3 py-2 border-2 ${
              activeButton === "domani"
                ? "bg-rosso text-white"
                : "border-rosso text-rosso bg-white hover:bg-rosso hover:text-white"
            } font-bold transition-colors duration-300 border-rosso`}
          />
          <Button
            label={"Prossima settimana"}
            onClick={() => toggleButton("prossima", onNextWeekClick)}
            className={`w-full lg:w-auto px-3 py-2 border-2 ${
              activeButton === "prossima"
                ? "bg-rosso text-white"
                : "border-rosso text-rosso bg-white hover:bg-rosso hover:text-white"
            } font-bold transition-colors duration-300 border-rosso`}
          />
          {/* SwitchBox e Reset Filtri */}
          <div className="flex items-center justify-between w-full mt-4 md:mt-0 gap-4"> 
            <SwitchBox
              label={"Gratis"}
              value={isFree}
              setValue={setIsFree}

            />
            <Button
              label={"Reset Filtri"}
              onClick={handleReset}
              className="w-full px-3 py-2 border-2 border-gray-500 text-gray-500 bg-white hover:bg-gray-500 hover:text-white font-bold transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
