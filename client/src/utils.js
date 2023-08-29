
async function send(endpoint, method, body, header = "application/json") {
    const response = await fetch(`http://localhost:3000/api${endpoint}`, {
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


// export async function api(endpoint, method = "GET", body, header = "application/json") {
//     // const token = localStorage.getItem("token");
//     // alert(endpoint)
//     // if (token) {
//     const response = await fetch(`http://localhost:3000/api${endpoint}`, {
//         method,
//         credentials: "include",
//         headers: {
//             "Content-Type": header
//         },
//         body: JSON.stringify(body),
//     });
//     const data = await (method === "GET" ? response.json() : response.text());
//     return data;
//     // }
// }
export async function api2(endpoint, method = "GET", body) {
    const response = await fetch(`http://localhost:3000/api${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    });
    const data = await (method === "GET" ? response.json() : response.text());
    return data;
}

export function checkz(check, post, user) {
    const matchingCheck = check.find(
        (c) => c.id_post === post && c.id_user === user

    );
    return matchingCheck;
}