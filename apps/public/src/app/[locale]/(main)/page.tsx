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

export default function Home() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div className="container py-8 md:py-12 space-y-16 md:space-y-24">
      {/* News Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t('latest_news')}
          </h2>
          <Link href={"/news"} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('view_all')}
          </Link>
        </div>

        <Suspense fallback={<ListSkeleton count={4} type="news" />}>
          <NewsSection />
        </Suspense>
      </section>

      {/* Articles Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t('fresh_articles')}
          </h2>
          <Link href={"/articles"} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('view_all')}
          </Link>
        </div>

        <Suspense fallback={<ListSkeleton count={3} type="article" />}>
          <ArticlesSection />
        </Suspense>
      </section>
    </div>
  );
}

async function NewsSection() {
  // Fetch news and categories in parallel
  const [newsRes, categoriesRes] = await Promise.all([
    api.public.getNews({ limit: 4 }), // 1 Hero + 3 Grid
    api.public.getCategories()
  ]);

  const news = newsRes.items;
  const categoryMap = new Map(categoriesRes.items.map((c) => [c.id, c.name]));

  // Use the first item as the "hero" news
  const [heroNews, ...otherNews] = news;

  return (
    <div className="grid gap-4 md:grid-cols-[3.5fr_1fr]">
      {/* Hero Card (Left) */}
      {heroNews && (
        <HeroCard
          content={heroNews}
          categoryName={heroNews.category_id ? categoryMap.get(heroNews.category_id) : undefined}
        />
      )}

      {/* Side Grid (Right) */}
      <div className="grid gap-4">
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

async function ArticlesSection() {
  const [articlesRes, categoriesRes] = await Promise.all([
    api.public.getArticles({ limit: 3 }),
    api.public.getCategories()
  ]);

  const articles = articlesRes.items;
  const categoryMap = new Map(categoriesRes.items.map((c) => [c.id, c.name]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {articles.map((item) => (
        <GridCard
          key={item.id}
          content={item} // Changed from item={item} to content={item} as per GridCard props seen in previous code
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
