import { buildUrl, getEnrichedHeaders } from '~/api/config';

export const getCategory = async (request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl('/api/admin/categories'), {
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

export const getCategoryById = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};

export const createCategory = async ({
  request,
  name,
}: {
  request: Request;
  name: string;
}) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const response = await fetch(buildUrl('/api/admin/categories'), {
    method: 'post',
    headers,
    body: JSON.stringify({ name }),
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};

export const updateCategory = async ({
  request,
  name,
  id,
}: {
  request: Request;
  name: string;
  id: string;
}) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const _method = 'PATCH';
  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, _method }),
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};

export const deleteCategory = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    method: 'delete',
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response;
};
