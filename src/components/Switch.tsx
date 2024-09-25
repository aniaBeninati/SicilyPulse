import React, { Dispatch, SetStateAction } from "react";

interface SwitchProps {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}

const Switch: React.FC<SwitchProps> = ({ active, setActive }) => {
  return (
    <div
      className={`relative w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ${active ? "bg-rosso" : "bg-giallo"}`}
      onClick={() => setActive(!active)}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${active ? "bg-rosso" : "bg-giallo"}`}
      />
      
      {/* Circle */}
      <div
        className={`absolute top-[2px] left-1 w-7 h-7 rounded-full shadow transition-transform duration-300 ${active ? "bg-giallo translate-x-8" : "bg-rosso"}`}
      />
    </div>
  );
};

export default Switch;
