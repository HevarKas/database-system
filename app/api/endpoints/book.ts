import { buildUrl, getEnrichedHeaders } from '../config';

export const getBooks = async (page: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const searchParams = new URLSearchParams();
  searchParams.set('page', page);
  searchParams.set('per_page', '10');

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

  const response = await fetch(buildUrl(`/api/admin/books`), {
    method: 'POST',
    headers,
    body: JSON.stringify(book),
  });

  if (response.ok) {
    return response;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return null;
};

export const updateBook = async (
  request: Request,
  book: BookData,
  id: string,
) => {
  const headers = await getEnrichedHeaders(request, true);

  const _method = 'PATCH';

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...book, _method }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response;
};

export const getBookById = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    headers,
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  return null;
};

export const deleteBook = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request, true);

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    method: 'delete',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }

  return response;
};
