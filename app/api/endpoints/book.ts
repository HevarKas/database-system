import { buildUrl, getEnrichedHeaders } from '~/api/config';
import { BookActionDataType } from '~/shared/types/pages/book';

export const getBooks = async (page: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const searchParams = new URLSearchParams();
  searchParams.set('page', page || '1');

  const response = await fetch(buildUrl(`/api/admin/books?${searchParams}`), {
    headers,
  });

  if (response.status === 401) {
    throw new Error('Unauthorized to access this resource');
  }

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};

export const getBookById = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};

export const createBook = async (
  request: Request,
  book: BookActionDataType,
) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const response = await fetch(buildUrl(`/api/admin/books`), {
    method: 'POST',
    headers,
    body: JSON.stringify(book),
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};

export const updateBook = async (
  request: Request,
  book: BookActionDataType,
  id: string,
) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const _method = 'PATCH';
  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...book, _method }),
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};

export const deleteBook = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    method: 'delete',
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};
