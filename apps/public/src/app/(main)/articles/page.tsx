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
} from "@/components/ui/item";
import { ContentSkeleton, ArticleCardSkeleton } from "@/components/ui/skeleton";
import { resolveMediaUrl } from "@/lib/api";
import { useArticles, useCategories } from "@/hooks/use-api";
import type { ContentListItem } from "@/lib/types";

const PAGE_SIZE = 9;

export default function ArticlesPage() {
    const [skip, setSkip] = useState(0);
    const [items, setItems] = useState<ContentListItem[]>([]);
    const { data, loading } = useArticles({ limit: PAGE_SIZE, skip });
    const { categoryMap } = useCategories();

    useEffect(() => {
        if (!data) return;
        setItems((prev) => (skip === 0 ? data.items : [...prev, ...data.items]));
    }, [data, skip]);

    const getCategoryName = (categoryId?: number | null) => {
        if (!categoryId) return null;
        return categoryMap.get(categoryId) || null;
    };

    const hero = items[0];
    const secondary = items.slice(1, 4);
    const rest = items.slice(4);
    const hasMore = data ? items.length < data.total : false;

    return (
        <>
            <div className="grid gap-4">
                <h1 className="text-foreground font-medium text-3xl md:text-4xl lg:text-5xl">
                    Свежие статьи
                </h1>
                <div className="grid gap-4 md:grid-cols-[3.5fr_1fr]">
                    {loading && items.length === 0 ? (
                        <ContentSkeleton />
                    ) : hero ? (
                        <HeroArticleCard
                            content={hero}
                            categoryName={getCategoryName(hero.category_id)}
                        />
                    ) : null}
                    <div className="grid gap-4">
                        {loading && items.length === 0
                            ? Array.from({ length: 3 }).map((_, index) => (
                                <ArticleCardSkeleton key={index} />
                            ))
                            : secondary.map((item) => (
                                <SquareArticleCard
                                    key={item.id}
                                    content={item}
                                    categoryName={getCategoryName(item.category_id)}
                                />
                            ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                    <SquareArticleCard
                        key={item.id}
                        content={item}
                        categoryName={getCategoryName(item.category_id)}
                    />
                ))}
                {loading && items.length > 0
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <ArticleCardSkeleton key={`more-${index}`} />
                    ))
                    : null}
                {hasMore ? (
                    <div className="col-span-full flex items-center justify-center">
                        <Button
                            variant={"secondary"}
                            size={"lg"}
                            className="rounded-full"
                            onClick={() => setSkip(items.length)}
                            disabled={loading}
                        >
                            {loading ? "Загрузка..." : "Загрузить еще"}
                        </Button>
                    </div>
                ) : null}
            </div>
        </>
    );
}

function HeroArticleCard({
    content,
    categoryName,
}: {
    content: ContentListItem;
    categoryName: string | null;
}) {
    const imageUrl =
        resolveMediaUrl(content.cover_image_url) ||
        "https://images.unsplash.com/photo-1768639527374-5a0071b66fd7";

    return (
        <Item className="h-fit lg:sticky lg:top-0" asChild>
            <Link href={`/content/${content.slug}`}>
                <ItemHeader>
                    <Image
                        src={imageUrl}
                        alt={content.title}
                        width={1920}
                        height={1080}
                        className="aspect-3/4 md:aspect-video w-full rounded-sm object-cover"
                    />
                </ItemHeader>
                <ItemContent>
                    <ItemTitle className="text-foreground font-medium text-3xl md:text-4xl lg:text-5xl">
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

function SquareArticleCard({
    content,
    categoryName,
}: {
    content: ContentListItem;
    categoryName: string | null;
}) {
    const imageUrl =
        resolveMediaUrl(content.cover_image_url) ||
        "https://images.unsplash.com/photo-1764377724194-c4b7356a4851";

    return (
        <Item className="h-fit" asChild>
            <Link href={`/content/${content.slug}`}>
                <ItemHeader>
                    <Image
                        src={imageUrl}
                        alt={content.title}
                        width={1920}
                        height={1080}
                        className="aspect-square w-full rounded-sm object-cover"
                    />
                </ItemHeader>
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
