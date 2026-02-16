"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemContent,
    ItemHeader,
    ItemTitle,
    ItemFooter,
    ItemGroup,
} from "@/components/ui/item";
import { ArticleCardSkeleton } from "@/components/ui/skeleton";
import { api, resolveMediaUrl } from "@/lib/api";
import type { ContentListItem, Category } from "@/lib/types";

export default function RelatedArticles() {
    const [articles, setArticles] = useState<ContentListItem[]>([]);
    const [categories, setCategories] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.public.getArticles({ limit: 3 }),
            api.public.getCategories(),
        ])
            .then(([articlesData, categoriesData]) => {
                setArticles(articlesData.items);
                setCategories(
                    new Map(categoriesData.items.map((cat: Category) => [cat.id, cat.name]))
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const getCategoryName = (categoryId?: number | null) => {
        if (!categoryId) return null;
        return categories.get(categoryId) || null;
    };

    return (
        <div className="grid gap-4">
            <div className="flex items-end-safe justify-between">
                <h2 className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
                    Читайте также
                </h2>
                <Button variant={"link"} asChild>
                    <Link href={"/articles"}>Смотреть еще</Link>
                </Button>
            </div>
            <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <ArticleCardSkeleton key={index} />
                    ))
                    : articles.map((item) => (
                        <RelatedArticleCard
                            key={item.id}
                            content={item}
                            categoryName={getCategoryName(item.category_id)}
                        />
                    ))}
            </ItemGroup>
        </div>
    );
}

function RelatedArticleCard({
    content,
    categoryName,
}: {
    content: ContentListItem;
    categoryName: string | null;
}) {
    const imageUrl = resolveMediaUrl(content.cover_image_url);

    return (
        <Item className="h-fit" asChild>
            <Link href={`/content/${content.slug}`}>
                {imageUrl && (
                    <ItemHeader>
                        <Image
                            src={imageUrl}
                            alt={content.title}
                            width={1920}
                            height={1080}
                            className="aspect-square w-full rounded-sm object-cover"
                        />
                    </ItemHeader>
                )}
                <ItemContent>
                    <ItemTitle className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
                        {content.title}
                    </ItemTitle>
                </ItemContent>
                <ItemFooter>
                    {categoryName ? `${categoryName} • ` : ""}
                    {new Date(content.published_at || content.created_at).toLocaleDateString()}
                </ItemFooter>
            </Link>
        </Item>
    );
}
