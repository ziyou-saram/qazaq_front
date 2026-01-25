import type {
    CategoryList,
    Comment,
    CommentList,
    Content,
    ContentListItem,
    PaginatedResponse,
    UserResponse,
    APIError,
} from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function resolveMediaUrl(path?: string | null) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${API_URL}${path}`;
    return `${API_URL}/${path}`;
}

class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                const error: APIError = await response.json().catch(() => ({
                    detail: `HTTP ${response.status}: ${response.statusText}`,
                }));
                throw new Error(error.detail);
            }

            return response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Public endpoints (no authentication required)
    public = {
        // Categories
        getCategories: () =>
            this.request<CategoryList>('/public/categories'),

        // Content
        getNews: (params?: { limit?: number; skip?: number; category_id?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
            if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
            if (params?.category_id !== undefined) {
                searchParams.set('category_id', String(params.category_id));
            }
            const query = searchParams.toString();
            return this.request<PaginatedResponse<ContentListItem>>(
                `/public/news${query ? `?${query}` : ''}`
            );
        },

        getArticles: (params?: { limit?: number; skip?: number; category_id?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
            if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
            if (params?.category_id !== undefined) {
                searchParams.set('category_id', String(params.category_id));
            }
            const query = searchParams.toString();
            return this.request<PaginatedResponse<ContentListItem>>(
                `/public/articles${query ? `?${query}` : ''}`
            );
        },

        getContentBySlug: (slug: string) =>
            this.request<Content>(`/public/content/${slug}`),

        // Comments
        getComments: (contentId: number, params?: { limit?: number; skip?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
            if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
            const query = searchParams.toString();
            return this.request<CommentList>(
                `/public/content/${contentId}/comments${query ? `?${query}` : ''}`
            );
        },
    };

    // Authenticated endpoints (require token)
    public auth = {
        login: (credentials: { email: string; password: string }) =>
            this.request<{ access_token: string; refresh_token: string; token_type: string }>(
                '/auth/login',
                {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                }
            ),

        register: (data: {
            username: string;
            email: string;
            password: string;
            first_name?: string;
            last_name?: string;
        }) =>
            this.request<{ id: number; username: string; email: string }>(
                '/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                }
            ),
        me: (token: string) =>
            this.request<UserResponse>('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            }),
    };

    // Social interactions (authenticated)
    public social = {
        getLikeStatus: (contentId: number, token: string) =>
            this.request<{ liked: boolean }>(`/public/content/${contentId}/like/status`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        likeContent: (contentId: number, token: string) =>
            this.request<{ message: string }>(`/public/content/${contentId}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            }),

        unlikeContent: (contentId: number, token: string) =>
            this.request<{ message: string }>(`/public/content/${contentId}/like`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }),

        addComment: (
            contentId: number,
            text: string,
            token: string,
            parentId?: number
        ) =>
            this.request<Comment>(`/public/content/${contentId}/comments`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: text, parent_id: parentId }),
            }),
    };
}

// Export singleton instance
export const api = new APIClient(API_URL);

// Export for custom instances if needed
export { APIClient };
