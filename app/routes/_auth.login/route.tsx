import { Form, redirect, useActionData, useNavigation } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { tokenCookie } from '~/lib/auth/cookies';
import { getAccessToken } from '~/api/endpoints/auth';

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
    return {
      error: 'Invalid email or password. Please try again.',
    };
  }
};

function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();

  const isLoading = navigation.state === 'loading';
  const error = actionData?.error;

  return (
    <Form method="post" className="flex flex-col gap-4 p-6 w-full">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      <Label className="dark:text-gray-300" htmlFor="email">
        Your email address
      </Label>
      <Input
        className="dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-400"
        id="email"
        type="email"
        name="email"
        required
      />
      <Label className="dark:text-gray-300" htmlFor="password">
        Your password
      </Label>
      <Input
        className="dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-400"
        id="password"
        type="password"
        name="password"
        required
      />
      <Button
        className="dark:bg-white dark:text-gray-900"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </Form>
  );
}

export default Login;
