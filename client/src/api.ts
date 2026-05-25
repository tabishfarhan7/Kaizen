const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data && typeof data.error === 'string'
        ? data.error
        : 'Request failed. Please try again.'

    throw new Error(message)
  }

  return data as T
}
