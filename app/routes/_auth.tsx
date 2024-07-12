import { Outlet } from '@remix-run/react';
import AKlogo from '~/assets/AKlogo';

function Auth() {
  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <header className="flex items-center justify-center pt-8">
          <AKlogo width={300} height={300} />
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Auth;
