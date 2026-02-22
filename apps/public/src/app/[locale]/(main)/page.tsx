import { Suspense } from "react";
import { api } from "@/lib/api";
import { GridCard } from "@/components/cards/grid-card";
import { HeroCard } from "@/components/cards/hero-card";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ContentSkeleton, NewsCardSkeleton, ArticleCardSkeleton } from "@/components/ui/skeleton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="container py-8 md:py-12 space-y-16 md:space-y-24">
      {/* News Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b-2 border-foreground pb-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary shrink-0"></div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground uppercase tracking-tight">
              {t('latest_news')}
            </h2>
          </div>
          <Link href={"/news"} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors">
            {t('view_all')}
          </Link>
        </div>

        <Suspense fallback={<ListSkeleton count={4} type="news" />}>
          <NewsSection locale={locale} />
        </Suspense>
      </section>

      {/* Articles Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b-2 border-foreground pb-2 mb-8 mt-12">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary shrink-0"></div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground uppercase tracking-tight">
              {t('fresh_articles')}
            </h2>
          </div>
          <Link href={"/articles"} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors">
            {t('view_all')}
          </Link>
        </div>

        <Suspense fallback={<ListSkeleton count={3} type="article" />}>
          <ArticlesSection locale={locale} />
        </Suspense>
      </section>
    </div>
  );
}

async function NewsSection({ locale }: { locale: string }) {
  // Fetch news and categories in parallel
  const [newsRes, categoriesRes] = await Promise.all([
    api.public.getNews({ limit: 4, language: locale }), // 1 Hero + 3 Grid
    api.public.getCategories()
  ]);

  const news = newsRes.items;
  const categoryMap = new Map(categoriesRes.items.map((c) => [c.id, c.name]));

  // Use the first item as the "hero" news
  const [heroNews, ...otherNews] = news;

  return (
    <div className="grid gap-8 md:grid-cols-[2.5fr_1fr] lg:grid-cols-[3fr_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
      {/* Hero Card (Left) */}
      <div className="md:pr-8">
        {heroNews && (
          <HeroCard
            content={heroNews}
            categoryName={heroNews.category_id ? categoryMap.get(heroNews.category_id) : undefined}
          />
        )}
      </div>

      {/* Side Grid (Right) */}
      <div className="flex flex-col gap-6 md:pl-8">
        {otherNews.map((item) => (
          <GridCard
            key={item.id}
            content={item}
            categoryName={item.category_id ? categoryMap.get(item.category_id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

async function ArticlesSection({ locale }: { locale: string }) {
  const [articlesRes, categoriesRes] = await Promise.all([
    api.public.getArticles({ limit: 3, language: locale }),
    api.public.getCategories()
  ]);

  const articles = articlesRes.items;
  const categoryMap = new Map(categoriesRes.items.map((c) => [c.id, c.name]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {articles.map((item) => (
        <GridCard
          key={item.id}
          content={item}
          categoryName={item.category_id ? categoryMap.get(item.category_id) : undefined}
        />
      ))}
    </div>
  );
}

function ListSkeleton({ count, type }: { count: number; type: "news" | "article" }) {
  if (type === "news") {
    return (
      <div className="grid gap-4 md:grid-cols-[3.5fr_1fr]">
        <ContentSkeleton />
        <div className="grid gap-4">
          {Array.from({ length: count - 1 }).map((_, i) => <ContentSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
