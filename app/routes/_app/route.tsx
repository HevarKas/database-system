import { Outlet, redirect } from '@remix-run/react';
import { useState } from 'react';
import Header from '~/components/header';
import LogoutComponent from '~/components/pages/logout';
import Sidebar from '~/components/sidebar';
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
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full overflow-hidden">
        <Header onOpenModal={handleOpenModal} />
        <main className="flex-1 p-8 overflow-scroll bg-white dark:bg-gray-900">
          <LogoutComponent isOpen={isOpen} onClose={handleCloseModal} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
