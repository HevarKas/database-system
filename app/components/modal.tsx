import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: ReactNode;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, header, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-4 relative z-10">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            {header}
          </div>
          <button
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="max-h-[500px] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
