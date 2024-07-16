import { redirect } from '@remix-run/node';
import { getToken, removeToken } from '~/lib/auth/cookies';

export const loader = async ({ request }: { request: Request }) => {
  const token = await getToken(request);

  if (!token) {
    return redirect('/login');
  }

  return null;
};

export const action = async () => {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await removeToken(),
    },
  });
};
