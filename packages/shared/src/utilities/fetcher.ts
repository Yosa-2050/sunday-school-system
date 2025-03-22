import { getCookie } from "cookies-next";
import { COOKIE_ACCESS_TOKEN } from "../constants/cookie.const";
import logger from "./logger";

// Define the expected error response shape from your API
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

// Define a generic type for the fetcher response
interface FetcherResponse<T> {
  data?: T;
}

// Custom error class to include status code
class FetchError extends Error {
  public status: number;
  public info?: ApiErrorResponse;

  constructor(message: string, status: number, info?: ApiErrorResponse) {
    super(message);
    this.status = status;
    this.info = info;
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

const headersToObject = (headers: HeadersInit): Record<string, string> => {
  const result: Record<string, string> = {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value;
    });
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      result[key] = value;
    }
  } else if (typeof headers === "object" && headers !== null) {
    Object.assign(result, headers);
  }
  return result;
};

// Generic fetcher function with type parameter T for the expected response data
export const fetcher = async <T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = getCookie(COOKIE_ACCESS_TOKEN);

  const existingHeaders = options?.headers
    ? headersToObject(options.headers)
    : {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...existingHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      const errorMessage = errorData.message || `Error: ${response.statusText}`;
      throw new FetchError(errorMessage, response.status, errorData);
    }

    return (await response.json()) as T;
  } catch (error) {
    logger.error("Error during fetch:", error);

    if (error instanceof FetchError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new FetchError(error.message || "An unexpected error occurred.", 0);
    }

    throw new FetchError("An unexpected error occurred.", 0);
  }
};
