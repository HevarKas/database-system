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
  const headers = await getEnrichedHeaders(request);

  const body = new URLSearchParams();

  body.set('email', email);
  body.set('password', password);

  const response = await fetch(buildUrl('/api/admin/token/create'), {
    body,
    method: 'post',
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};
