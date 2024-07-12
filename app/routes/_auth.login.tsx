import { Form } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

export const loader = () => {
  return { message: 'Login' };
};

export const action = () => {
  return {
    redirect: '/dashboard',
  };
};

function Login() {
  return (
    <Form method="post" className="flex flex-col gap-4">
      <Label htmlFor="email">Your email address</Label>
      <Input id="email" type="email" required />
      <Label htmlFor="password">Your password</Label>
      <Input id="password" type="password" required />
      <Button type="submit">Login</Button>
    </Form>
  );
}

export default Login;
