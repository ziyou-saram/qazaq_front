import { notFound, redirect } from "next/navigation";
import { getServerApi } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ApproveButton, RevisionCard } from "./review-forms";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ReviewContentPage({ params }: Props) {
    const { id } = await params;
    const contentId = parseInt(id);
    if (isNaN(contentId)) notFound();

    const api = await getServerApi();
    let content;

    try {
        content = await api.request<any>(`/cms/chief-editor/content/${contentId}`);
    } catch (e) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Проверка материала</h1>
                        <Badge variant="outline">{content.type}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Автор: {content.author.first_name} {content.author.last_name}
                    </p>
                </div>
                <div className="flex gap-2">
                    <ApproveButton contentId={contentId} />
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-lg font-semibold">Заголовок</Label>
                        <div className="text-2xl font-bold">{content.title}</div>
                    </div>

                    {content.cover_image_url && (
                        <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
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

                <div className="col-span-1">
                    <RevisionCard contentId={contentId} />
                </div>
            </div>
        </div>
    );
}
