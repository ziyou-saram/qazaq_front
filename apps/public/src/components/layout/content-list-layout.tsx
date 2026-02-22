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
                <div className="flex items-end justify-between border-b-[3px] border-foreground pb-4 mb-4 mt-8">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-primary shrink-0"></div>
                        <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-tight">
                            {title}
                        </h1>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-[2.5fr_1fr] lg:grid-cols-[3fr_1fr] divide-y md:divide-y-0 md:divide-x divide-border mt-4 mb-12">
                    {loading && items.length === 0 ? (
                        <ContentSkeleton />
                    ) : hero ? (
                        <div className="md:pr-8">
                            <HeroCard
                                content={hero}
                                categoryName={getCategoryName(hero.category_id)}
                            />
                        </div>
                    ) : null}
                    <div className="flex flex-col gap-6 md:pl-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
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
                            variant={"outline"}
                            size={"lg"}
                            className="rounded-none border-2 border-border hover:border-foreground font-bold uppercase tracking-widest mt-12"
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
