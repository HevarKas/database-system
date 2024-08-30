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

type BookData = {
  name: string;
  description: string;
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
  category_id: number;
  barcode: string;
};

export const createBook = async (request: Request, book: BookData) => {
  const headers = await getEnrichedHeaders(request, true);

  console.log('book', book);
  const response = await fetch(buildUrl(`/api/admin/books`), {
    method: 'POST',
    headers,
    body: JSON.stringify(book),
  });

  console.log('response', response);

  if (response.ok) {
    return response;
  }

  if (!response.ok) {
    const error = await response.json();
    console.log('error', error);
  }

  return null;
};
