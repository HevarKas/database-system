import { buildUrl, getEnrichedHeaders } from '~/api/config';

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

export const createBook = async (request: Request, bookFormData: FormData) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/books`), {
    method: 'POST',
    headers,
    body: bookFormData,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};

export const updateBook = async (
  request: Request,
  bookFormData: FormData,
  id: string,
) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/books/${id}`), {
    method: 'POST',
    headers,
    body: bookFormData,
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
