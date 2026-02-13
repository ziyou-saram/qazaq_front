import { notFound, redirect } from "next/navigation";
import { Link } from "lucide-react";
import { ContentForm } from "@/components/content/content-form";
import { updateArticle } from "@/actions/articles";
import { getServerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmitForReviewButton } from "@/components/content/submit-button";
import { submitForReview } from "@/actions/submit-review";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: Props) {
    const { id } = await params;
    const contentId = parseInt(id);
    if (isNaN(contentId)) notFound();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const api = await getServerApi();
    let content;

    try {
        content = await api.request<any>(`/cms/editor/content/${contentId}`);
    } catch (e) {
        notFound();
    }

    const updateAction = updateArticle.bind(null, contentId);
    const submitAction = submitForReview.bind(null, contentId);

    let latestRevision = null;
    if (content.status === "needs_revision") {
        try {
            const revisions = await api.request<any[]>(`/cms/editor/content/${contentId}/revisions`);
            if (revisions && revisions.length > 0) {
                // Assuming revisions are ordered or latest is last/first. Backend doesn't explicitly sort revisions in relationship?
                // Revisions relationship usually default order. Let's assume standard append.
                latestRevision = revisions[revisions.length - 1];
            }
        } catch (e) {
            console.error("Failed to fetch revisions", e);
        }
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование</h1>
                    <p className="text-muted-foreground">
                        {content.title}
                    </p>
                </div>
                {(content.status === "draft" || content.status === "needs_revision") && (
                    <SubmitForReviewButton contentId={contentId} status={content.status} />
                )}
            </div>

            {content.status === "needs_revision" && latestRevision && (
                <div className="bg-destructive/10 border-destructive/20 border p-4 rounded-lg text-destructive">
                    <h3 className="font-semibold mb-1">Статья возвращена на доработку</h3>
                    <p className="text-sm">{latestRevision.comment}</p>
                </div>
            )}

            <Separator />

            <ContentForm
                defaultValues={{
                    title: content.title,
                    excerpt: content.excerpt || "",
                    content: content.content,
                    type: content.type,
                    cover_image_url: content.cover_image_url || "",
                    category_id: content.category_id || undefined,
                }}
                onSubmit={updateAction}
                submitLabel="Сохранить изменения"
                accessToken={token}
            />
        </div>
    );
}
