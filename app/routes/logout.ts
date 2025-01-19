import { redirect } from '@remix-run/node';
import { getToken, removeToken, removeRoles } from '~/lib/auth/cookies';

export const loader = async ({ request }: { request: Request }) => {
  try {
    const token = await getToken(request);

    if (!token) {
      return redirect('/login');
    }

    return null;
  } catch (error) {
    console.error('Error in loader:', error);

    throw new Response('Unable to process your request. Please try again later.', { status: 500 });
  }
};


export const action = async () => {
  const tokenClear = await removeToken();
  const rolesClear = await removeRoles();

  return redirect('/login', {
    headers: {
      'Set-Cookie': [tokenClear, rolesClear].join(', '), // Pass both cookies as a single string
    },
  });
};
