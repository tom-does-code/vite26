const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';
const tokenKey = 'momentum.token';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function saveToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${baseUrl}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (res.status === 401) {
    clearToken();
    throw new ApiError(401, 'Your session has expired, please log in again.');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, readErrorMessage(payload));
  }

  return payload as T;
}

interface ErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

function readErrorMessage(payload: ErrorPayload | null) {
  if (payload?.message) {
    return payload.message;
  }

  if (payload?.errors) {
    const first = Object.values(payload.errors)[0];

    if (Array.isArray(first) && first.length > 0) {
      return first[0];
    }
  }

  return 'Something went wrong, please try again.';
}

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body?: unknown) => request<T>(path, 'POST', body ?? {}),
  put: <T>(path: string, body: unknown) => request<T>(path, 'PUT', body),
  patch: <T>(path: string) => request<T>(path, 'PATCH'),
  remove: <T>(path: string) => request<T>(path, 'DELETE')
};
