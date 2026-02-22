import Link from "next/link";
import Image from "next/image";
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemFooter,
    ItemHeader,
} from "@/components/ui/item";
import { Pin } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";
import type { ContentListItem } from "@/lib/types";

interface GridCardProps {
    content: ContentListItem;
    categoryName?: string | null;
}

export function GridCard({ content, categoryName }: GridCardProps) {
    const imageUrl = resolveMediaUrl(content.cover_image_url);

    return (
        <Link
            href={`/content/${content.slug}`}
            className="group flex flex-col h-fit outline-none focus-visible:ring-2 focus-visible:ring-ring border-b border-border pb-5 hover:border-foreground transition-colors"
        >
            {imageUrl && (
                <div className="mb-3 w-full overflow-hidden shrink-0">
                    <Image
                        src={imageUrl}
                        alt={content.title}
                        width={800}
                        height={600}
                        className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </div>
            )}

            <div className="flex flex-col gap-1.5 items-start">
                {categoryName && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                        {categoryName}
                    </span>
                )}

                <h3 className="text-foreground font-serif font-bold text-[1.35rem] leading-[1.15] md:text-2xl md:leading-[1.15] group-hover:opacity-80 transition-opacity">
                    {content.is_pinned && (
                        <Pin className="inline-block relative -top-[2px] mr-1.5 h-4 w-4 md:h-5 md:w-5 text-primary rotate-45 shrink-0" />
                    )}
                    <span className="inline">{content.title}</span>
                </h3>
            </div>

            <div className="mt-4 text-[11px] text-muted-foreground uppercase tracking-widest font-semibold shrink-0">
                {new Date(content.published_at || content.created_at).toLocaleDateString('ru-RU')}
            </div>
        </Link>
    );
}
