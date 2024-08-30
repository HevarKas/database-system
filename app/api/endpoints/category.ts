import { buildUrl, getEnrichedHeaders } from '../config';

export const getCategory = async (request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl('/api/admin/categories'), {
    headers,
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  return null;
};

export const createCategory = async ({
  request,
  name,
}: {
  request: Request;
  name: string;
}) => {
  const headers = await getEnrichedHeaders(request, true);

  const response = await fetch(buildUrl('/api/admin/categories'), {
    method: 'post',
    headers,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
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
  const headers = await getEnrichedHeaders(request, true);

  const _method = 'PATCH';
  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, _method }),
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return response;
};

export const getCategoryById = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    headers,
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  return null;
};

export const deleteCategory = async (id: string, request: Request) => {
  const headers = await getEnrichedHeaders(request, true);

  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    method: 'delete',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }

  return response;
};
