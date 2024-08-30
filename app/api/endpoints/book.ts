import { buildUrl, getEnrichedHeaders } from '../config';

export const getBooks = async (page: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const searchParams = new URLSearchParams();
  searchParams.set('page', page);

  const response = await fetch(buildUrl(`/api/admin/books?${searchParams}`), {
    headers,
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  return null;
};
