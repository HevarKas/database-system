import { FaTimes } from 'react-icons/fa';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: ReactNode;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, header, children }: ModalProps) => {
  if (!isOpen) return null;

  const overlayClasses = 'fixed inset-0 bg-gray-900 bg-opacity-50';
  const modalClasses =
    'bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-4 relative z-10';
  const headerClasses =
    'flex justify-between items-center border-b pb-2 mb-4 text-xl font-bold text-gray-800 dark:text-white';
  const closeButtonClasses =
    'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none';
  const contentClasses = 'max-h-[500px] overflow-y-auto';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className={overlayClasses} onClick={onClose} aria-hidden="true" />
      <div className={modalClasses}>
        <header className={headerClasses}>
          <div>{header}</div>
          <button
            className={closeButtonClasses}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>
        </header>
        <main className={contentClasses}>{children}</main>
      </div>
    </div>
  );
};

export default Modal;
