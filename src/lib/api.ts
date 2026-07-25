const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Envelope<T> {
  success: boolean;
  result: T;
  message: string | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function unwrap<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !body || body.success === false) {
    throw new ApiError(body?.message ?? `Requisição falhou (${response.status}).`, response.status);
  }

  return body.result;
}

/// Fetcher usado pelo SWR — GET simples, lança ApiError em caso de falha (SWR
/// trata isso como estado de erro naturalmente).
export async function fetcher<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });
  return unwrap<T>(response);
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return unwrap<T>(response);
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body?: unknown) => request<T>(path, "PUT", body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};
