import { Outlet, redirect } from '@remix-run/react';
import AKlogo from '~/assets/AKlogo';
import { getToken } from '~/lib/auth/cookies';

export const loader = async ({ request }: { request: Request }) => {
  try {
    const token = await getToken(request);

    if (token) {
      return redirect('/dashboard');
    }

    return null;
  } catch (error) {
    console.error('Error fetching token:', error);

    throw new Response('Unable to fetch token. Please try again later.', { status: 500 });
  }
};

function Auth() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full flex flex-col items-center">
        <AKlogo width={300} height={300} />
        <main className="p-4 w-full">
          <Outlet />
        </main>
      </div>
    </section>
  );
}

export default Auth;
