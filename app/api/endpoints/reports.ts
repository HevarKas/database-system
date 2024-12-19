import { buildUrl, getEnrichedHeaders } from '~/api/config';

export const getReports = async (request: Request) => {
  const headers = await getEnrichedHeaders(request);

  const response = await fetch(buildUrl(`/api/admin/reports/index`), {
    headers,
  });

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw errorResponse;
  }

  return response.json();
};

export const getReportsByTimeRange = async (
    request: Request,
    from: string,
    to: string,
    ) => {
    const headers = await getEnrichedHeaders(request);
    
    const response = await fetch(
        buildUrl(`/api/admin/reports/income?from=${from}&to=${to}`),
        {
        headers,
        },
    );
    
    if (response.status !== 200) {
        const errorResponse = await response.json();
        throw errorResponse;
    }
    
    return response.json();
};

