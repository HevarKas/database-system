const API_URL = 'http://178.18.250.240:9050';

export const baseApiUrl = API_URL;

export const buildUrl = (pathname: string, searchParams?: URLSearchParams) => {
  const url = new URL(API_URL);
  url.pathname += pathname;
  if (searchParams !== undefined) url.search = searchParams.toString();

  return url.href;
};

export const getHeaders = () => {
  const headers = new Headers();

  headers.set('Accept', 'application/json');
  headers.set('X-Application-Platform', 'Web-Browser');

  return headers;
};
