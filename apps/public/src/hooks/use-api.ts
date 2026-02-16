"use client";

import { useEffect, useMemo, useState } from 'react';
import type { Category, Content, ContentListItem, PaginatedResponse } from '@/lib/types';
import { api } from '@/lib/api';

// Hook for fetching categories
export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.public
            .getCategories()
            .then((response) => setCategories(response.items))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const categoryMap = useMemo(() => {
        return new Map(categories.map((category) => [category.id, category.name]));
    }, [categories]);

    return { categories, categoryMap, loading, error };
}

// Hook for fetching news
export function useNews(params?: { limit?: number; skip?: number; category_id?: number }) {
    const [data, setData] = useState<PaginatedResponse<ContentListItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.public
            .getNews(params)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [params?.limit, params?.skip, params?.category_id]);

    return { data, loading, error };
}

// Hook for fetching articles
export function useArticles(params?: { limit?: number; skip?: number; category_id?: number }) {
    const [data, setData] = useState<PaginatedResponse<ContentListItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.public
            .getArticles(params)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [params?.limit, params?.skip, params?.category_id]);

    return { data, loading, error };
}

// Hook for fetching featured content
export function useFeaturedContent() {
    const [content, setContent] = useState<ContentListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.public.getNews({ limit: 4, skip: 0 }),
            api.public.getArticles({ limit: 4, skip: 0 }),
        ])
            .then(([news, articles]) => {
                const combined = [...news.items, ...articles.items].sort((a, b) => {
                    // Sort by pinned status first
                    if (a.is_pinned !== b.is_pinned) {
                        return a.is_pinned ? -1 : 1;
                    }
                    // Then by date
                    const aDate = new Date(a.published_at || a.created_at).getTime();
                    const bDate = new Date(b.published_at || b.created_at).getTime();
                    return bDate - aDate;
                });
                setContent(combined.slice(0, 4));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { content, loading, error };
}

// Hook for fetching single content by slug
export function useContent(slug: string) {
    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        api.public
            .getContentBySlug(slug)
            .then(setContent)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    return { content, loading, error };
}
