import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { getToken, tokenCookie } from '~/lib/auth/cookies';
import { getAccessToken } from '~/api/endpoints/auth';

export const loader = async ({ request }: { request: Request }) => {
  const token = await getToken(request);

  if (token) {
    return redirect('/dashboard');
  }

  return null;
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const loginData = await getAccessToken({ request, email, password });

    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize(loginData.data.token),
      },
    });
  } catch (error) {
    throw new Error('failed to login');
  }
};

function Login() {
  const navigation = useNavigation();
  const error = useActionData<string>();

  const isLoading = navigation.state === 'loading';

  return (
    <Form method="post" className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>
      )}
      <Label className="dark:text-black" htmlFor="email">
        Your email address
      </Label>
      <Input
        className="dark:text-black dark:bg-white"
        id="email"
        type="email"
        name="email"
        required
      />
      <Label className="dark:text-black" htmlFor="password">
        Your password
      </Label>
      <Input
        className="dark:text-black dark:bg-white"
        id="password"
        type="password"
        name="password"
        required
      />
      <Button
        className="dark:text-white dark:bg-black"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'logging in...' : 'Log in'}
      </Button>
    </Form>
  );
}

export default Login;
