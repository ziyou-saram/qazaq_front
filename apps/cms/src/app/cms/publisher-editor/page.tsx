import { getServerApi } from "@/lib/api";
import { ContentListItem } from "@/lib/types";
import { ContentTable } from "@/components/content/content-table";

export default async function PublishingEditorDashboardPage() {
    const api = await getServerApi();
    let queue: { items: ContentListItem[]; total: number; skip: number; limit: number } = {
        items: [],
        total: 0,
        skip: 0,
        limit: 100
    };

    try {
        const response = await api.request<{ items: ContentListItem[]; total: number; skip: number; limit: number }>("/cms/publishing/approved-queue");
        // Handle both list and paginated response formats just in case
        if (Array.isArray(response)) {
            queue.items = response;
            queue.total = response.length;
        } else {
            queue = response;
        }
    } catch (e) {
        console.error("Failed to fetch publishing queue", e);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Центр публикации</h1>
            </div>

            <ContentTable
                data={queue}
                baseUrl="/cms/publisher-editor"
                isChiefEditor={true}
            />
        </div>
    );
}