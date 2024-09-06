import { useState } from 'react';
import { Outlet, redirect } from '@remix-run/react';

import Header from '~/components/header/header';
import Sidebar from '~/components/sidebar/sidebar';
import LogoutComponent from '~/components/header/logoutModal';

import { getToken } from '~/lib/auth/cookies';

export const loader = async ({ request }: { request: Request }) => {
  const token = await getToken(request);

  if (!token) {
    return redirect('/login');
  }

  return null;
};

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex h-screen">
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
