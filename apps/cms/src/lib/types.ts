export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: number | null;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface CategoryList {
    items: Category[];
    total: number;
}

export interface CategoryCreate {
    name: string;
    description?: string;
    parent_id?: number | null;
    order?: number;
}

export interface CategoryUpdate {
    name?: string;
    description?: string;
    parent_id?: number | null;
    order?: number;
}

export interface UserPublicProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    bio?: string | null;
    avatar_url?: string | null;
    created_at: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "user" | "editor" | "chief_editor" | "publishing_editor" | "moderator" | "admin";
    bio?: string | null;
    avatar_url?: string | null;
    is_active: boolean;
    created_at: string;
}

export type ContentType = 'news' | 'article';
export type ContentStatus = 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published';

export interface ContentListItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    type: ContentType;
    status: ContentStatus;
    is_pinned: boolean;
    cover_image_url?: string | null;
    category_id?: number | null;
    author: UserPublicProfile;
    view_count: number;
    published_at?: string | null;
    updated_at: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
}

export interface Content extends ContentListItem {
    content: string;
    author_id: number;
}

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    user: UserPublicProfile;
    content_id: number;
    parent_id?: number | null;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    replies?: Comment[];
}

export interface CommentList {
    items: Comment[];
    total: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    limit: number;
}

export interface APIError {
    detail: string;
}
