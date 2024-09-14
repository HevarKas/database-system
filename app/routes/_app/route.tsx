import { useState } from 'react';
import {
  Outlet,
  redirect,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import ErrorIcon from '~/assets/ErrorIcon';

import Header from '~/components/header/header';
import Sidebar from '~/components/sidebar/sidebar';
import LogoutComponent from '~/components/header/logoutModal';

import { getToken } from '~/lib/auth/cookies';
import { useLanguage } from '~/contexts/LanguageContext';
import classNames from 'classnames';

export const loader = async ({ request }: { request: Request }) => {
  const token = await getToken(request);

  if (!token) {
    return redirect('/login');
  }

  return null;
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { rtl } = useLanguage();

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <div className={classNames('flex h-screen', { rtl: rtl })}>
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header onOpenModal={handleOpenModal} />
        <main className="flex-1 p-8 overflow-auto bg-white dark:bg-gray-900">
          <LogoutComponent isOpen={isOpen} onClose={handleCloseModal} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] dark:bg-gray-900 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex-shrink-0 mr-4">
            <ErrorIcon />
          </div>
          <div>
            {isRouteErrorResponse(error) ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {error.status} {error.statusText}
                </h1>
                <p className="text-gray-800 dark:text-gray-300">{error.data}</p>
              </>
            ) : error instanceof Error ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Error
                </h1>
                <p className="text-gray-800 dark:text-gray-300">
                  {error.message}
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
                Unknown Error
              </h1>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
}
