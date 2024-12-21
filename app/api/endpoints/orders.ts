import { buildUrl, getEnrichedHeaders } from "../config";

export const postOrder = async (request: Request, formDataToSend: FormData) => {
    const headers = await getEnrichedHeaders(request);

    const response = await fetch(buildUrl(`/api/admin/orders`), {  // Updated URL
        method: 'POST',
        headers,
        body: formDataToSend,
    });
    
    if (response.status !== 200) {
        const errorResponse = await response.json();
        throw errorResponse;
    }
    
    return response;
}
