import React, { ChangeEvent } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface SearchProps {
  query: string;
  onSearch: (query: string) => void;
  onReset: () => void; // Funzione per gestire il reset del campo di ricerca
}

function Search({ query, onSearch}: SearchProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value); // Esegui la ricerca quando l'input cambia
  };

  return (
    <div className="flex items-center border-2 border-rosso p-5 bg-white h-10 w-full">
      <input
        type="text"
        placeholder="Cerca..."
        value={query}
        onChange={handleChange}
        className="flex-1 border-none outline-none p-2 text-sm h-full text-black"
      />

      <button className="bg-transparent border-none cursor-pointer p-2">
        <i className="fas fa-search text-gray-600 text-xs"></i>
      </button>
    </div>
  );
}

export default Search;
