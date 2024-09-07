import { tokenCookie } from '~/lib/auth/cookies';

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error(
    'API_URL environment variable is not defined. Please set it in your environment.',
  );
}

export const baseApiUrl = API_URL;

export const buildUrl = (pathname: string) => {
  return `${baseApiUrl}${pathname}`;
};

type HeadersOptions = {
  contentType?: string;
};

export const getEnrichedHeaders = async (
  request: Request,
  options: HeadersOptions = {},
) => {
  const headers = new Headers();
  const cookieHeader = request.headers.get('Cookie');
  const token = await tokenCookie.parse(cookieHeader);

  headers.append('Referer', baseApiUrl);
  headers.append('Accept', 'application/json');

  if (options.contentType) {
    headers.append('Content-Type', options.contentType);
  }

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  return headers;
};
