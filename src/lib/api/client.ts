/**
 * Central API client. Swap MOCK_MODE to false and set BASE_URL when backend is ready.
 * Auth token (set by Login) is read from localStorage and attached as Bearer.
 */
export const MOCK_MODE = true;
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("eco_admin_auth");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** Simulate network latency for mock data */
export const mockDelay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
