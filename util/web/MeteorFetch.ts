export default function MeteorFetch(url: string, options?: RequestInit) {
    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token") || "notoken"
        }
    }).then(r => r.json())
}