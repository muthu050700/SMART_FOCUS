// Common CORS handler for Next.js app routes
export function handleCors(request, responseData, status = 200) {
    return new Response(
        JSON.stringify(responseData),
        {
            status,
            headers: {
                'Access-Control-Allow-Origin': 'https://smart-focus-mv3x.vercel.app',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            },
        }
    );
}

export function handleCorsOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://smart-focus-mv3x.vercel.app',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
