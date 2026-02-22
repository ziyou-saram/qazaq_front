import { Suspense } from "react";
import { api } from "@/lib/api";
import { ContentListClient } from "@/components/content/content-list-client";
import { ContentSkeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'articles' });
    const tCommon = await getTranslations({ locale, namespace: 'home' });

    return {
        title: `${t('title')} - Qazaq News`,
        description: tCommon('meta_description'),
    };
}

const PAGE_SIZE = 9;

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'articles' });

    const [data, categories] = await Promise.all([
        api.public.getArticles({ limit: PAGE_SIZE, skip: 0, language: locale }),
        api.public.getCategories(),
    ]);

    return (
        <Suspense fallback={<ContentSkeleton />}>
            <ContentListClient
                initialItems={data.items}
                total={data.total}
                title={t('all_articles')}
                type="article"
                categories={categories.items}
                locale={locale}
            />
        </Suspense>
    );
}
