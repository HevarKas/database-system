import { buildUrl, getEnrichedHeaders } from '../config';

type loginType = {
  email: string;
  password: string;
  request: Request;
};

export const getAccessToken = async ({
  request,
  email,
  password,
}: loginType) => {
  const headers = await getEnrichedHeaders(request, {
    contentType: 'application/json',
  });

  const body = JSON.stringify({ email, password });

  console.log('Request Body:', body);
  console.log('Request Headers:', headers);

  const response = await fetch(buildUrl('/api/admin/token/create'), {
    method: 'POST',
    headers,
    body,
  });

  console.log('Response:', response);

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};
