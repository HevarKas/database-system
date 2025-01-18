import { createCookie } from '@remix-run/node';

export const tokenCookie = createCookie('token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  secrets: ['your-secret-key'],
  maxAge: 60 * 60 * 24 * 7,
});

export const rolesCookie = createCookie('roles', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  secrets: ['your-secret-key'],
  maxAge: 60 * 60 * 24 * 7,
});

export const getToken = async (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  return await tokenCookie.parse(cookieHeader);
};

export const getRoles = async (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  return await rolesCookie.parse(cookieHeader);
};

export const removeToken = () => {
  return tokenCookie.serialize('', { maxAge: 0 });
};

export const removeRoles = () => {
  return rolesCookie.serialize('', { maxAge: 0 });
};
