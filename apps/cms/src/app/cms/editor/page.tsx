import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerApi } from "@/lib/api";
import { ContentListItem } from "@/lib/types";
import { ContentTable } from "@/components/content/content-table";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorDashboardPage({ searchParams }: PageProps) {
    const api = await getServerApi();
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const limit = Number(resolvedSearchParams.limit) || 20;
    const skip = Number(resolvedSearchParams.skip) || 0;
    const search = resolvedSearchParams.search as string || "";
    const status = resolvedSearchParams.status as string || "";

    let content: { items: ContentListItem[]; total: number; skip: number; limit: number } = {
        items: [],
        total: 0,
        skip: 0,
        limit: 20
    };

    try {
        const queryParams = new URLSearchParams();
        queryParams.set("skip", skip.toString());
        queryParams.set("limit", limit.toString());
        if (search) queryParams.set("search", search);
        if (status) queryParams.set("status", status);

        content = await api.request(`/cms/editor/content?${queryParams.toString()}`);
    } catch (e) {
        console.error("Failed to fetch content", e);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Мои материалы</h1>
                <Button asChild>
                    <Link href="/cms/editor/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Создать
                    </Link>
                </Button>
            </div>

            <ContentTable
                data={content}
                baseUrl="/cms/editor"
            />
        </div>
    );
}