import { notFound } from "next/navigation";
import { getServerApi } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PublishActions } from "./publish-actions";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PublishingInterfacePage({ params }: Props) {
    const { id } = await params;
    const contentId = parseInt(id);
    if (isNaN(contentId)) notFound();

    const api = await getServerApi();
    let content;

    try {
        content = await api.request<any>(`/cms/publishing/content/${contentId}`);
    } catch (e) {
        notFound();
    }

    const isPublished = content.status === "published";

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Публикация материала</h1>
                        <Badge variant={isPublished ? "default" : "outline"}>
                            {isPublished ? "Опубликовано" : "Готово к публикации"}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <PublishActions id={contentId} isPublished={isPublished} />
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Заголовок</Label>
                    <div className="text-2xl font-bold">{content.title}</div>
                </div>

                {content.cover_image_url && (
                    <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted max-w-2xl">
                        <img
                            src={content.cover_image_url}
                            alt="Cover"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Лид (Excerpt)</Label>
                    <p className="text-muted-foreground text-lg">{content.excerpt}</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Содержание</Label>
                    <div
                        className="prose prose-neutral dark:prose-invert max-w-none border rounded-lg p-4 min-h-[400px]"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                </div>
            </div>
        </div>
    );
}
