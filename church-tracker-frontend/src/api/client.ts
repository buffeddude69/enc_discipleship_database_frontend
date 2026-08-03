// Simple fetch wrapper -- no extra libraries needed for an app this size.
// In production, set VITE_API_BASE_URL (e.g. in Vercel's project settings)
// to your deployed backend's URL. Locally, it defaults to your Django
// dev server.
export const BACKEND_ORIGIN = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_BASE_URL = `${BACKEND_ORIGIN}/api`;

const TOKEN_KEY = "church_tracker_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(typeof body === "string" ? body : JSON.stringify(body));
    this.status = status;
    this.body = body;
  }
}

// DRF error bodies vary in shape: a plain string, {"non_field_errors": [...]},
// or {"field_name": [...]}. This pulls out the first readable message.
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) return fallback;
  const body = err.body;
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    for (const value of Object.values(body as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
      if (typeof value === "string") return value;
    }
  }
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content (e.g. DELETE) has no body to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

// Builds a FormData object from a plain object, so file uploads (photos)
// can travel alongside regular fields. Arrays are appended as repeated
// keys, which DRF understands for list/M2M fields.
function toFormData(body: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),

  // Multipart variants -- use these when the payload may include a File
  // (profile pictures, remarks photos). Content-Type is left unset so
  // the browser can add the correct multipart boundary itself.
  postForm: <T>(path: string, body: Record<string, unknown>) =>
    request<T>(path, { method: "POST", body: toFormData(body) }),
  patchForm: <T>(path: string, body: Record<string, unknown>) =>
    request<T>(path, { method: "PATCH", body: toFormData(body) }),
};
