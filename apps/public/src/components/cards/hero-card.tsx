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
