import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getServerApi } from "@/lib/api";
import { ContentListItem } from "@/lib/types";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Черновик", variant: "secondary" },
    in_review: { label: "На проверке", variant: "default" },
    needs_revision: { label: "Требует правок", variant: "destructive" },
    approved: { label: "Одобрено", variant: "outline" },
    published: { label: "Опубликовано", variant: "default" }, // Usually green if we had it
};

export default async function EditorDashboardPage() {
    const api = await getServerApi();
    let content: { items: ContentListItem[] } = { items: [] };

    try {
        content = await api.request("/cms/editor/content");
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Заголовок</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Дата создания</TableHead>
                            <TableHead className="w-[100px]">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {content.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    У вас пока нет материалов. Создайте первый!
                                </TableCell>
                            </TableRow>
                        ) : (
                            content.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>
                                        {item.type === "article" ? "Статья" : "Новость"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusMap[item.status]?.variant || "outline"}>
                                            {statusMap[item.status]?.label || item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.created_at).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/cms/editor/${item.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}