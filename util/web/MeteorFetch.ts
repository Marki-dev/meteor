export default function MeteorFetch(url: string, options?: RequestInit) {
    return fetch("/api" + url, {
        ...options,
        headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
        }
    }).then(r => r.json())
}