import { Outlet } from '@remix-run/react';
import Header from '~/components/header';
import Sidebar from '~/components/sidebar';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
