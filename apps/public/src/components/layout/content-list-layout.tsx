"use client";

import { Button } from "@/components/ui/button";
import { ContentSkeleton, ArticleCardSkeleton } from "@/components/ui/skeleton";
import type { ContentListItem } from "@/lib/types";
import { HeroCard } from "@/components/cards/hero-card";
import { GridCard } from "@/components/cards/grid-card";
import { useTranslations } from "next-intl";

interface ContentListLayoutProps {
    title: string;
    items: ContentListItem[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    categoryMap: Map<number, string>;
}

export function ContentListLayout({
    title,
    items,
    loading,
    hasMore,
    onLoadMore,
    categoryMap,
}: ContentListLayoutProps) {
    const tCommon = useTranslations('common');

    const getCategoryName = (categoryId?: number | null) => {
        if (!categoryId) return null;
        return categoryMap.get(categoryId) || null;
    };

    const hero = items[0];
    const secondary = items.slice(1, 4);
    const rest = items.slice(4);

    return (
        <>
            <div className="grid gap-4">
                <h1 className="text-foreground font-medium text-3xl md:text-4xl lg:text-5xl">
                    {title}
                </h1>
                <div className="grid gap-4 md:grid-cols-[3.5fr_1fr]">
                    {loading && items.length === 0 ? (
                        <ContentSkeleton />
                    ) : hero ? (
                        <HeroCard
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
                                <GridCard
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
                    <GridCard
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
                            onClick={onLoadMore}
                            disabled={loading}
                        >
                            {loading ? tCommon('loading') : tCommon('load_more')}
                        </Button>
                    </div>
                ) : null}
            </div>
        </>
    );
}
