import type { APIError, UserResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_URL) {
    console.warn("NEXT_PUBLIC_API_URL is not set");
}

class APIClient {
    private baseURL: string;
    private accessToken?: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    public setAccessToken(token: string) {
        this.accessToken = token;
    }

    public async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: HeadersInit = {
            ...options?.headers,
        };

        if (!(options?.body instanceof FormData)) {
            (headers as Record<string, string>)["Content-Type"] = "application/json";
        }

        if (this.accessToken) {
            (headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error: APIError | { detail: Array<{ loc: string[]; msg: string }> } =
                await response.json().catch(() => ({
                    detail: `HTTP ${response.status}: ${response.statusText}`,
                }));

            if (Array.isArray(error.detail)) {
                const message = error.detail
                    .map((item) => `${item.loc?.join(".") || "field"}: ${item.msg}`)
                    .join("; ");
                throw new Error(message);
            }

            throw new Error(error.detail);
        }

        return response.json();
    }

    public auth = {
        login: (credentials: { email: string; password: string }) =>
            this.request<{ access_token: string; refresh_token: string; token_type: string }>(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify(credentials),
                }
            ),
        register: (data: {
            username: string;
            email: string;
            password: string;
            first_name: string;
            last_name: string;
            role: "editor" | "chief_editor" | "publishing_editor" | "moderator" | "user";
        }) =>
            this.request<UserResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        me: (token?: string) => {
            const headers: HeadersInit = {};
            if (token) {
                (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
            }
            return this.request<UserResponse>("/auth/me", { headers });
        }
    };

    public media = {
        upload: (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return this.request<{ url: string }>("/media/upload", {
                method: "POST",
                body: formData,
            });
        }
    };
}

export const api = new APIClient(API_URL);

export function resolveMediaUrl(path?: string | null) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseUrl}${path}`;
}

export async function getServerApi() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const serverApi = new APIClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

    if (token) {
        serverApi.setAccessToken(token);
    }

    return serverApi;
}
