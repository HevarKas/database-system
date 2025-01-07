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

export const getOrders = async (page: string, status: string, search: string, request: Request) => {
    const headers = await getEnrichedHeaders(request);
    const searchParams = new URLSearchParams();

    searchParams.set('page', page);
    searchParams.set('status', status);
    if (search) {
    searchParams.set('search', search);
    }

    const response = await fetch(buildUrl(`/api/admin/orders?${searchParams}`), {
        headers,
    });
    
    if (response.status !== 200) {
        const errorResponse = await response.json();
        throw errorResponse;
    }
    
    return response.json();
}

export const deleteOrder = async (id: string, request: Request) => {
    const headers = await getEnrichedHeaders(request, {
        contentType: 'application/json',
    });

    const response = await fetch(buildUrl(`/api/admin/orders/${id}`), {
        method: 'delete',
        headers,
    });
    
    if (response.status !== 200) {
        const errorResponse = await response.json();
        throw errorResponse;
    }
    
    return response;
}

export const getOrderById = async (id: string, request: Request) => {
    const headers = await getEnrichedHeaders(request);

    const response = await fetch(buildUrl(`/api/admin/orders/${id}`), {
        headers,
    });
    
    if (response.status !== 200) {
        const errorResponse = await response.json();
        throw errorResponse;
    }
    
    return response.json();
}

export const updateOrder = async (request: Request, formDataToSend: FormData, id: string) => {
    const headers = await getEnrichedHeaders(request);

    const response = await fetch(buildUrl(`/api/admin/orders/${id}`), {
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