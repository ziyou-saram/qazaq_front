import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";
import { api, resolveMediaUrl } from "@/lib/api";
import { NewsCard } from "@/components/cards/news-card";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

async function SearchResults({ query }: { query: string }) {
    if (!query) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl text-muted-foreground">Введите запрос для поиска</h2>
            </div>
        );
    }

    try {
        const results = await api.public.search(query);

        if (results.items.length === 0) {
            return (
                <div className="text-center py-12">
                    <h2 className="text-xl text-muted-foreground">По запросу "{query}" ничего не найдено</h2>
                </div>
            );
        }

        return (
            <div className="grid gap-4 md:grid-cols-2">
                {results.items.map((item: any) => (
                    <NewsCard
                        key={item.id}
                        content={item}
                        categoryName={null} // Search results might not have category detail easily available, or we can fetch it but for now null is safe
                    />
                ))}
            </div>
        );
    } catch (e) {
        console.error(e);
        return (
            <div className="text-center py-12 text-destructive">
                Произошла ошибка при поиске. Попробуйте позже.
            </div>
        );
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-8">
                Поиск: {query}
            </h1>
            <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
                <SearchResults query={query} />
            </Suspense>
        </div>
    );
}
