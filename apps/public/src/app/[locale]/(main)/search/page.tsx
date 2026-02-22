import { Suspense } from "react";
import { api } from "@/lib/api";
import { GridCard } from "@/components/cards/grid-card";
import SearchFilters from "./_components/search-filters";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ searchParams, params }: SearchPageProps) {
    const { q } = await searchParams;
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'search' });

    return {
        title: q ? `${t('results')}: ${q} - Qazaq News` : `${t('results')} - Qazaq News`,
        description: "Qazaq News Search",
    };
}

// Separate component to use `useTranslations` (which works in Server Components too if async? No, needs setup)
// Actually, in Server Components we usually use `getTranslations` or pass data.
// But we can call `useTranslations` in Server Components if we await it? No, `useTranslations` is a hook.
// In Server Components we use `await getTranslations(locale)`.
// However, `SearchResults` is an async component, so we can fetch translations there.

async function SearchResults({ query, categoryId, locale }: { query?: string; categoryId?: number; locale: string }) {
    const t = await getTranslations({ locale, namespace: 'search' });
    const tCommon = await getTranslations({ locale, namespace: 'common' });

    try {
        const results = await api.public.search({ q: query, category_id: categoryId, limit: 20, language: locale });

        if (results.items.length === 0) {
            return (
                <div className="text-center py-12">
                    <h2 className="text-xl text-muted-foreground">{t('no_results')}</h2>
                    <p className="text-muted-foreground mt-2">Try changing search parameters</p>
                </div>
            );
        }

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {results.items.map((item) => (
                    <GridCard
                        key={item.id}
                        content={item}
                        categoryName={null}
                    />
                ))}
            </div>
        );
    } catch (e) {
        console.error(e);
        return (
            <div className="text-center py-12 text-destructive">
                {tCommon('error')}
            </div>
        );
    }
}

import { Category } from "@/lib/types";

export default async function SearchPage({ searchParams, params }: SearchPageProps) {
    const { q, category } = await searchParams;
    const { locale } = await params;
    const tCommon = await getTranslations({ locale, namespace: 'common' });

    // Fetch categories for the filter component
    let categoriesList: Category[] = [];
    try {
        const categoriesRes = await api.public.getCategories({ has_content: true });
        categoriesList = categoriesRes.items;
    } catch (e) {
        console.error("Failed to fetch categories", e);
    }

    // Resolve category slug to id
    let categoryId: number | undefined;
    if (category) {
        const cat = categoriesList.find((c) => c.slug === category);
        if (cat) categoryId = cat.id;
    }

    return (
        <div className="container py-10">
            <SearchFilters categories={categoriesList} />

            <Suspense fallback={<div className="text-center py-12">{tCommon('loading')}</div>}>
                <SearchResults query={q} categoryId={categoryId} locale={locale} />
            </Suspense>
        </div>
    );
}
