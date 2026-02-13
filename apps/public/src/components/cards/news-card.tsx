import Link from "next/link";
import Image from "next/image";
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemFooter,
    ItemMedia,
} from "@/components/ui/item";
import { resolveMediaUrl } from "@/lib/api";
import type { ContentListItem } from "@/lib/types";

interface NewsCardProps {
    content: ContentListItem;
    categoryName?: string | null;
}

export function NewsCard({ content, categoryName }: NewsCardProps) {
    const imageUrl = resolveMediaUrl(content.cover_image_url || content.cover_image);

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
