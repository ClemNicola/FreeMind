import useSessionStore from "../hooks/useSessionStore";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const extractErrorMessage = (body: unknown): string | null => {
  if (!body || typeof body !== "object" || !("message" in body)) return null;
  const raw = (body as { message: unknown }).message;
  if (Array.isArray(raw)) return raw.join(", ");
  if (typeof raw === "string") return raw;
  return null;
};

export const apiInstance = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const token = useSessionStore.getState().accessToken;

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body: unknown = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const fallback =
      response.statusText || `Request failed with status ${response.status}`;
    const message = extractErrorMessage(body) ?? fallback;
    throw new ApiError(response.status, message, body);
  }

  return {
    data: body,
    status: response.status,
    headers: response.headers,
  } as T;
};
