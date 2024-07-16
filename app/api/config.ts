// config.ts
import { tokenCookie } from '~/lib/auth/cookies';

const API_URL = 'http://178.18.250.240:9050';

export const baseApiUrl = API_URL;

export const buildUrl = (pathname: string) => {
  return `${baseApiUrl}${pathname}`;
};

export const getEnrichedHeaders = async (
  request: Request,
  isPost?: boolean,
) => {
  const headers = new Headers();
  const cookieHeader = request.headers.get('Cookie');
  const token = await tokenCookie.parse(cookieHeader);

  headers.append('Referer', baseApiUrl);
  headers.append('Accept', 'application/json');
  if (isPost) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
};
