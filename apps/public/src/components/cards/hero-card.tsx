import Link from "next/link";
import Image from "next/image";
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemFooter,
    ItemHeader,
    ItemDescription,
} from "@/components/ui/item";
import { Pin } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";
import type { ContentListItem } from "@/lib/types";

interface HeroCardProps {
    content: ContentListItem;
    categoryName?: string | null;
}

export function HeroCard({ content, categoryName }: HeroCardProps) {
    const imageUrl = resolveMediaUrl(content.cover_image_url);

    return (
        <Link
            href={`/content/${content.slug}`}
            className="group flex flex-col h-fit lg:sticky lg:top-0 border-b-[3px] border-foreground lg:border-none pb-8 lg:pb-0 mb-8 lg:mb-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {imageUrl && (
                <div className="mb-5 w-full overflow-hidden shrink-0 border-b-[6px] border-foreground">
                    <Image
                        src={imageUrl}
                        alt={content.title}
                        width={1200}
                        height={800}
                        className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            )}

            <div className="flex flex-col gap-3 grow items-start">
                {categoryName && (
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-background">
                        {categoryName}
                    </span>
                )}

                <h2 className="text-foreground font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] group-hover:opacity-80 transition-opacity">
                    {content.is_pinned && (
                        <Pin className="inline-block relative -top-1 mr-2 h-6 w-6 md:h-8 md:w-8 text-primary rotate-45 shrink-0" />
                    )}
                    <span className="inline">{content.title}</span>
                </h2>

                {content.excerpt && (
                    <p className="text-foreground/80 font-serif text-lg md:text-xl lg:text-2xl mt-2 leading-relaxed max-w-2xl">
                        {content.excerpt}
                    </p>
                )}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-border text-sm text-foreground uppercase tracking-widest font-bold shrink-0">
                {new Date(content.published_at || content.created_at).toLocaleDateString('ru-RU')}
            </div>
        </Link>
    );
}
