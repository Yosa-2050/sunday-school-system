import { getCookie } from "cookies-next";
import { COOKIE_ACCESS_TOKEN } from "../constants/cookie.const";
import logger from "./logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

const headersToObject = (headers: HeadersInit): Record<string, string> => {
    const result: Record<string, string> = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            result[key] = value;
        });
    } else if (Array.isArray(headers)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        headers.forEach(([key, value]) => {
            result[key] = value;
        });
    } else if (typeof headers === 'object') {
        Object.assign(result, headers);
    }
    return result;
};

export const fetcher = async (endpoint: string, options?: RequestInit) => {
    const token = getCookie(COOKIE_ACCESS_TOKEN);

    const existingHeaders = options?.headers ? headersToObject(options.headers) : {};

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...existingHeaders,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers, });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        logger.error("Error during fetch:", error);
        throw error;
    }
};
