"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemFooter,
  ItemMedia,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useNews, useArticles, useFeaturedContent, useCategories } from "@/hooks/use-api";
import { ContentSkeleton, NewsCardSkeleton, ArticleCardSkeleton } from "@/components/ui/skeleton";
import { resolveMediaUrl } from "@/lib/api";
import type { ContentListItem } from "@/lib/types";

export default function Home() {
  const { content: featured, loading: featuredLoading } = useFeaturedContent();
  const { data: newsData, loading: newsLoading } = useNews({ limit: 6 });
  const { data: articlesData, loading: articlesLoading } = useArticles({ limit: 3 });
  const { categoryMap } = useCategories();

  const getCategoryName = (categoryId?: number | null) => {
    if (!categoryId) return null;
    return categoryMap.get(categoryId) || null;
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[3.5fr_1fr]">
        {featuredLoading ? (
          <ContentSkeleton />
        ) : featured && featured[0] ? (
          <FeaturedContent content={featured[0]} categoryName={getCategoryName(featured[0].category_id)} />
        ) : null}

        <div className="grid gap-4">
          {featuredLoading
            ? Array.from({ length: 3 }).map((_, i) => <ContentSkeleton key={i} />)
            : featured?.slice(1, 4).map((item) => (
              <FeaturedContentSmall
                key={item.id}
                content={item}
                categoryName={getCategoryName(item.category_id)}
              />
            ))}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-end-safe justify-between">
          <h2 className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
            Последние новости
          </h2>
          <Button variant={"link"} asChild>
            <Link href={"/news"}>Смотреть все</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {newsLoading
            ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
            : newsData?.items.map((item) => (
              <NewsCard
                key={item.id}
                content={item}
                categoryName={getCategoryName(item.category_id)}
              />
            ))}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-end-safe justify-between">
          <h2 className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
            Свежие статьи
          </h2>
          <Button variant={"link"} asChild>
            <Link href={"/articles"}>Смотреть все</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articlesLoading
            ? Array.from({ length: 3 }).map((_, i) => <ArticleCardSkeleton key={i} />)
            : articlesData?.items.map((item) => (
              <ArticleCard
                key={item.id}
                content={item}
                categoryName={getCategoryName(item.category_id)}
              />
            ))}
        </div>
      </div>
    </>
  );
}

import { Pin } from "lucide-react";

// ... existing imports ...

function FeaturedContent({
  content,
  categoryName,
}: {
  content: ContentListItem;
  categoryName: string | null;
}) {
  const imageUrl =
    resolveMediaUrl(content.cover_image_url)

  return (
    <Item className="h-fit lg:sticky lg:top-0" asChild>
      <Link href={`/content/${content.slug}`}>
        {imageUrl && (
          <ItemHeader>
            <Image
              src={imageUrl}
              alt={content.title}
              width={1920}
              height={1080}
              className="aspect-3/4 md:aspect-video w-full rounded-sm object-cover"
            />
          </ItemHeader>
        )}
        <ItemContent>
          <ItemTitle className="text-foreground font-medium text-3xl md:text-4xl lg:text-5xl flex items-center gap-2">
            {content.is_pinned && <Pin className="h-6 w-6 md:h-8 md:w-8 text-primary rotate-45 shrink-0" />}
            {content.title}
          </ItemTitle>
          {content.excerpt && (
            <ItemDescription className="text-muted-foreground line-clamp-2">
              {content.excerpt}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemFooter>
          {categoryName ? `${categoryName} • ` : ""}
          {new Date(content.published_at || content.created_at).toLocaleDateString()}
        </ItemFooter>
      </Link>
    </Item>
  );
}

function FeaturedContentSmall({
  content,
  categoryName,
}: {
  content: ContentListItem;
  categoryName: string | null;
}) {
  const imageUrl =
    resolveMediaUrl(content.cover_image_url)

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
          <ItemTitle className="text-foreground font-medium text-lg md:text-xl lg:text-2xl flex items-center gap-2">
            {content.is_pinned && <Pin className="h-4 w-4 md:h-5 md:w-5 text-primary rotate-45 shrink-0" />}
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

function NewsCard({
  content,
  categoryName,
}: {
  content: ContentListItem;
  categoryName: string | null;
}) {
  const imageUrl =
    resolveMediaUrl(content.cover_image_url)

  return (
    <Item className="h-fit gap-4 lg:gap-8" asChild role={"listitem"}>
      <Link href={`/content/${content.slug}`}>
        {imageUrl && (
          <ItemMedia>
            <Image
              src={imageUrl}
              alt={content.title}
              width={1920}
              height={1080}
              className="aspect-square w-full rounded-sm object-cover size-48 lg:size-56"
            />
          </ItemMedia>
        )}
        <ItemContent>
          <ItemTitle className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
            {content.title}
          </ItemTitle>
          <ItemFooter>
            {categoryName ? `${categoryName} • ` : ""}
            {new Date(content.published_at || content.created_at).toLocaleDateString()}
          </ItemFooter>
        </ItemContent>
      </Link>
    </Item>
  );
}

function ArticleCard({
  content,
  categoryName,
}: {
  content: ContentListItem;
  categoryName: string | null;
}) {
  const imageUrl =
    resolveMediaUrl(content.cover_image_url)

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

const Hero = () => {
  return (
    <section>
      <div className="grid gap-4 md:gap-6">
        <h1 className="lg:text-9xl md:text-7xl text-5xl font-semibold">Code<br /><span className="text-primary">&</span><span className="text-muted-foreground">Culture</span></h1>
      </div>
    </section>
  )
}
