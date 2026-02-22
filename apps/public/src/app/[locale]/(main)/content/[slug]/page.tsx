import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ContentSkeleton } from "@/components/ui/skeleton";
import { api, resolveMediaUrl } from "@/lib/api";
import { renderContent } from "@/lib/render";
import SocialInteractions from "./_components/social-interactions";
import RelatedArticles from "./_components/related-articles";

import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    try {
        const content = await api.public.getContentBySlug(params.slug);
        return {
            title: `${content.title} - Qazaq News`,
            description: content.excerpt || content.title,
            openGraph: {
                images: content.cover_image_url ? [resolveMediaUrl(content.cover_image_url)!] : [],
            },
        };
    } catch (e) {
        return {
            title: "Статья - Qazaq News",
        };
    }
}

import { notFound } from "next/navigation";

export default async function ContentSlugPage(props: { params: Promise<{ slug: string, locale: string }> }) {
    const params = await props.params;

    let content;
    let categories;
    try {
        [content, categories] = await Promise.all([
            api.public.getContentBySlug(params.slug),
            api.public.getCategories(),
        ]);
    } catch (e) {
        notFound();
    }

    if (!content) notFound();

    const categoryMap = new Map(categories.items.map((c) => [c.id, c.name]));
    const categoryName = content.category_id ? categoryMap.get(content.category_id) : null;
    const coverImage = resolveMediaUrl(content.cover_image_url);

    return (
        <>
            <article className="max-w-3xl mx-auto flex flex-col gap-8 md:gap-12 mt-8 md:mt-12">
                <header className="flex flex-col gap-6 w-full">
                    {categoryName && (
                        <div className="text-sm font-bold uppercase tracking-widest text-primary border-b-[3px] border-primary inline-block pb-1 w-fit">
                            {categoryName}
                        </div>
                    )}
                    <h1 className="text-foreground font-serif font-bold text-4xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight">
                        {content.title}
                    </h1>
                    {content.excerpt ? (
                        <p className="text-foreground/80 font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed">
                            {content.excerpt}
                        </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-4 mt-2 py-4 border-y border-border text-xs md:text-sm font-sans uppercase tracking-widest text-muted-foreground font-bold">
                        <span>By Qazaq News</span>
                        <span className="text-border">•</span>
                        <time>{new Date(content.published_at || content.created_at).toLocaleDateString('ru-RU')}</time>
                        <span className="text-border">•</span>
                        <span>{content.view_count} views</span>
                    </div>
                </header>

                <div className="flex flex-col gap-8">
                    {coverImage && (
                        <figure className="w-full m-0">
                            <Image
                                src={coverImage}
                                alt={content.title}
                                width={1920}
                                height={1080}
                                className="w-full object-cover aspect-video"
                            />
                        </figure>
                    )}

                    <div
                        className="prose prose-lg md:prose-xl prose-neutral prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary max-w-none pb-16 border-b-[6px] border-foreground"
                        dangerouslySetInnerHTML={{ __html: renderContent(content.content) }}
                    />
                </div>
            </article>

            <Separator />

            <div className="grid gap-6">
                <SocialInteractions
                    contentId={content.id}
                    initialLikesCount={content.likes_count || 0}
                />
                <RelatedArticles locale={params.locale} />
            </div>
        </>
    );
}
