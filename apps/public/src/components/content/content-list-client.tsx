"use client";

import { useState, useMemo } from "react";
import { ContentListItem, Category } from "@/lib/types";
import { ContentListLayout } from "@/components/layout/content-list-layout";
import { api } from "@/lib/api";

const PAGE_SIZE = 9;

interface ContentListClientProps {
    initialItems: ContentListItem[];
    total: number;
    title: string;
    type: "news" | "article";
    categories: Category[];
}

export function ContentListClient({
    initialItems,
    total,
    title,
    type,
    categories,
}: ContentListClientProps) {
    const [items, setItems] = useState<ContentListItem[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(initialItems.length);

    const categoryMap = useMemo(() => {
        return new Map(categories.map((c) => [c.id, c.name]));
    }, [categories]);

    const hasMore = items.length < total;

    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const params = { limit: PAGE_SIZE, skip };
            const response = type === "news"
                ? await api.public.getNews(params)
                : await api.public.getArticles(params); // Assuming getArticles follows same signature

            if (response.items.length > 0) {
                setItems((prev) => [...prev, ...response.items]);
                setSkip((prev) => prev + response.items.length);
            }
        } catch (error) {
            console.error("Failed to load more items:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentListLayout
            title={title}
            items={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            categoryMap={categoryMap}
        />
    );
}
