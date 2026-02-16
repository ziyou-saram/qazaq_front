import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ContentSkeleton } from "@/components/ui/skeleton";
import { api, resolveMediaUrl } from "@/lib/api";
import { renderContent } from "@/lib/render";
import SocialInteractions from "./_components/social-interactions";
import RelatedArticles from "./_components/related-articles";

import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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

export default async function ContentSlugPage(props: { params: Promise<{ slug: string }> }) {
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
            <div className="max-w-5xl mx-auto flex flex-col gap-14 md:gap-16 lg:gap-28">
                <div className="grid gap-4 justify-center-safe text-center w-full max-w-6xl mx-auto">
                    <p className="text-muted-foreground">
                        {new Date(content.published_at || content.created_at).toLocaleDateString()}
                    </p>
                    <h1 className="text-foreground font-medium text-4xl md:text-5xl lg:text-6xl max-w-2xl">
                        {content.title}
                    </h1>
                    {content.excerpt ? (
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {content.excerpt}
                        </p>
                    ) : null}
                </div>

                <div className="grid gap-8">
                    {coverImage && (
                        <Image
                            src={coverImage}
                            alt={content.title}
                            width={1920}
                            height={1080}
                            className="w-full rounded-sm object-cover aspect-video"
                        />
                    )}
                    <div className="text-muted-foreground text-sm flex flex-wrap justify-center gap-2">
                        <span>Qazaq.kz</span>
                        <span>•</span>
                        <span>{categoryName || "Без категории"}</span>
                        <span>•</span>
                        <span>{content.view_count} просмотров</span>
                    </div>
                    <div
                        className="prose prose-lg prose-neutral max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderContent(content.content) }}
                    />
                </div>
            </div>

            <Separator />

            <div className="grid gap-6">
                <SocialInteractions
                    contentId={content.id}
                    initialLikesCount={content.likes_count || 0}
                />
                <RelatedArticles />
            </div>
        </>
    );
}
