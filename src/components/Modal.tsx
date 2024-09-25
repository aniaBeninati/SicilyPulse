import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg max-w-md w-full p-6 transform transition-all duration-300 scale-100">
        <h2 className="font-titolo text-2xl text-rosso mb-4 text-center">Grazie!</h2>
        <p className="mt-4 text-alight text-gray-700">
          Grazie per aver proposto il tuo evento. A seguito di un controllo, troverai il tuo evento insieme ai nostri.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
