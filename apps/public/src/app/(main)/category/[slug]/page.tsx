import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";
import { api, resolveMediaUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
    params: {
        slug: string;
    };
    searchParams?: {
        page?: string;
    };
}

import { NewsCard } from "@/components/cards/news-card";

async function CategoryContent({ slug, page, categoryName }: { slug: string; page: number; categoryName: string }) {
    try {
        const limit = 12;
        const skip = (page - 1) * limit;

        const results = await api.public.getContentByCategory(slug, { skip, limit });

        if (results.items.length === 0) {
            return (
                <div className="text-center py-12">
                    <h2 className="text-xl text-muted-foreground">В этой категории пока нет материалов</h2>
                </div>
            );
        }

        return (
            <div className="grid gap-4 md:grid-cols-2">
                {results.items.map((item: any) => (
                    <NewsCard
                        key={item.id}
                        content={item}
                        categoryName={categoryName}
                    />
                ))}
            </div>
        );
    } catch (e) {
        console.error(e);
        return (
            <div className="text-center py-12 text-destructive">
                Произошла ошибка при загрузке категории. Возможно, такой категории не существует.
            </div>
        );
    }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const { page } = await searchParams || {};
    const currentPage = Number(page) || 1;

    let categoryName = slug;
    try {
        const categories = await api.public.getCategories();
        const cat = categories.items.find((c: any) => c.slug === slug);
        if (cat) categoryName = cat.name;
    } catch (e) { }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-8 capitalize">
                {categoryName}
            </h1>
            <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
                <CategoryContent slug={slug} page={currentPage} categoryName={categoryName} />
            </Suspense>
        </div>
    );
}
