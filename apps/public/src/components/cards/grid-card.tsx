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
