
const apiUrl = import.meta.env.VITE_API_URL;
async function send(endpoint, method, body, header = "application/json") {
    const response = await fetch(`${apiUrl}/api${endpoint}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": header,
        },
        body: JSON.stringify(body),
    });
    const data = await (method === "GET" ? response.json() : response.text());
    //     
    return data;
}

export const api = {
    get: (endpoint) => send(endpoint, "GET"),
    post: (endpoint, body) => send(endpoint, "POST", body),
    put: (endpoint, body) => send(endpoint, "PUT", body),
    delete: (endpoint, body) => send(endpoint, "DELETE", body),
    post2: (endpoint, body, header) => send(endpoint, "POST", body, header),
};

export async function api2(endpoint, method = "GET", body) {
    try {
        const response = await fetch(`${apiUrl}/api${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: method === "GET" ? null : JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                status: errorData?.status || 500,
                message: errorData?.message || "Terjadi kesalahan. Silakan coba lagi.",
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in API call:", error);

        return {
            status: 500,
            message: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        };
    }
}



export function checkz(check, post, user) {
    const matchingCheck = check.find(
        (c) => c.id_post === post && c.id_user === user

    );
    return matchingCheck;
}