"use client";

import React from "react";
import { toast } from "react-toastify";

interface EventFormProps {
  formData: {
    title: string;
    image: string;
    tag: string[];
    description: string;
    dateStart: string;
    dateEnd: string;
    price: string;
    location: string;
    category: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onTagChange: (tags: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EventForm = ({
  formData,
  onChange,
  onTagChange,
  onSubmit,
}: EventFormProps) => {
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTag = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      onTagChange([...formData.tag, selectedTag]);
    } else {
      onTagChange(formData.tag.filter((tag) => tag !== selectedTag));
    }
  };

  const todayDate = new Date().toISOString().split("T")[0]; // Ottiene la data di oggi

  // const formatDate = (dateString: string) => {
  //   const [year, month, day] = dateString.split("-");
  //   return `${day}-${month}-${year}`;
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Formatta le date prima di inviarle
    // const formattedData = {
    //   ...formData,
    //   dateStart: formatDate(formData.dateStart),
    //   dateEnd: formatDate(formData.dateEnd),
    // };

    onSubmit(e);
    toast.success("Dati inviati!")
  };

  return (
    <form
      className="bg-white text-black p-6 shadow-lg w-full max-w-xl space-y-8 rounded-md "
      onSubmit={handleSubmit}
    >
      {/* Selezione Categoria */}
      <div>
        <label
          htmlFor="category"
          className="text-black font-semibold font-titolo"
        >
          Categoria
        </label>
        <select
          name="category"
          id="category"
          className="border p-2 w-full bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
          value={formData.category}
          onChange={onChange}
          required
        >
          <option value="" disabled>
            Seleziona Categoria
          </option>
          <option value="cultures">Cultura</option>
          <option value="foods">Sapori</option>
          <option value="activities">Attività</option>
        </select>
      </div>

      {/* Titolo e Luogo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="title"
            className="text-black font-semibold font-titolo"
          >
            Titolo
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Titolo"
            className="border p-2 w-full bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="text-black font-semibold font-titolo"
          >
            Luogo
          </label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Luogo"
            className="border p-2 w-full bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
            value={formData.location}
            onChange={onChange}
            required
          />
        </div>
      </div>

      {/* Descrizione */}
      <div>
        <label
          htmlFor="description"
          className="text-black font-semibold font-titolo"
        >
          Descrizione
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Descrizione"
          className="w-full border p-2 bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
          value={formData.description}
          onChange={onChange}
          required
        ></textarea>
      </div>

      {/* Tag */}
      <fieldset className="border p-4 text-black border-rosso ">
        <legend className="text-xl font-bold mb-4 text-black font-titolo">
          Tag:
        </legend>
        <div className="flex flex-wrap gap-4  ">
          {[
            "concerti",
            "festival",
            "arte",
            "moda",
            "mostra",
            "workshop",
            "teatro",
            "spettacolo",
            "ristorante",
            "fiera",
            "sagra",
            "tradizione",
            "famiglie",
            "ragazzi",
          ].map((tag) => (
            <label
              key={tag}
              className="inline-flex items-center w-1/2 md:w-1/5 text-black "
            >
              <input
                type="checkbox"
                value={tag}
                checked={formData.tag.includes(tag)}
                onChange={handleTagChange}
                className="mr-2 accent-rosso"
              />
              <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Date Inizio e Fine */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dateStart"
            className="text-black font-semibold font-titolo"
          >
            Data Inizio
          </label>
          <input
            type="date"
            name="dateStart"
            id="dateStart"
            className="border p-2 w-full bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
            value={formData.dateStart}
            onChange={onChange}
            min={todayDate}
            required
          />
        </div>
        <div>
          <label
            htmlFor="dateEnd"
            className="text-black font-semibold font-titolo"
          >
            Data Fine
          </label>
          <input
            type="date"
            name="dateEnd"
            id="dateEnd"
            className="border p-2 w-full bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
            value={formData.dateEnd}
            onChange={onChange}
            min={todayDate}
            required
          />
        </div>
      </div>

      {/* Prezzo */}
      <div>
        <label htmlFor="price" className="text-black font-semibold font-titolo">
          Prezzo
        </label>
        <input
          type="text"
          name="price"
          id="price"
          placeholder="Prezzo"
          className="w-full border p-2 bg-transparent text-black border-rosso focus:outline-none focus:ring-2 focus:ring-rosso focus:border-rosso transition-all"
          value={formData.price}
          onChange={onChange}
          required
        />
      </div>
    </form>
  );
};

export default EventForm;
