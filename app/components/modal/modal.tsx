import { ReactNode } from 'react';
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@remix-run/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: ReactNode;
  children: ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  variant?: 'danger' | 'success' | 'warning' | 'default';
}

const Modal = ({
  isOpen,
  onClose,
  header,
  children,
  submitLabel = 'Submit',
  onSubmit,
  variant = 'default',
}: ModalProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';
  const isSubmitting = navigation.state === 'submitting';
  if (!isOpen) return null;

  const overlayClasses = 'fixed inset-0 bg-black bg-opacity-50';
  const modalClasses =
    'bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative z-10';
  const headerClasses =
    'flex justify-between items-center border-b pb-3 mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100';
  const closeButtonClasses =
    'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none';
  const contentClasses = 'max-h-[500px] overflow-y-auto pb-4';
  const footerClasses = 'flex justify-end gap-4 border-t pt-4 mt-4';

  const buttonBaseClasses =
    'px-4 py-2 rounded transition-colors duration-200 focus:outline-none';

  const submitButtonClasses = classNames(buttonBaseClasses, {
    'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500':
      variant === 'danger',
    'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500':
      variant === 'success',
    'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500':
      variant === 'warning',
    'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300':
      variant === 'default',
  });

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
          <Button
            className={closeButtonClasses}
            onClick={onClose}
            variant="link"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </Button>
        </header>
        <main className={contentClasses}>{children}</main>
        {onSubmit && (
          <footer className={footerClasses}>
            <Button
              type="button"
              onClick={onClose}
              className={`${buttonBaseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600`}
            >
              {t('books.cancel')}
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              className={submitButtonClasses}
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? t('loading') : submitLabel}
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
