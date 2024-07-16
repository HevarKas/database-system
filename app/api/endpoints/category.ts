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

  try {
    const response = await fetch(buildUrl('/api/admin/categories'), {
      method: 'post',
      headers,
      body: JSON.stringify({ name }),
    });

    return response;
  } catch (error) {
    throw new Error('Failed to create category');
  }
};
