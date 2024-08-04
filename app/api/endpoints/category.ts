import { buildUrl, getEnrichedHeaders } from '../config';

export const getCategory = async (page: string, request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const searchParams = new URLSearchParams();
  searchParams.set('page', page);

  const response = await fetch(
    buildUrl(`/api/admin/categories?${searchParams}`),
    {
      headers,
    },
  );

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
  id: number;
}) => {
  const headers = await getEnrichedHeaders(request, true);

  const response = await fetch(buildUrl(`/api/admin/categories/${id}`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return response;
};
