import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
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

export default async function PublishingEditorDashboardPage() {
    const api = await getServerApi();
    let queue: { items: ContentListItem[] } = { items: [] };

    try {
        queue = await api.request("/cms/publishing/approved-queue");
    } catch (e) {
        console.error("Failed to fetch publishing queue", e);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Центр публикации</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Заголовок</TableHead>
                            <TableHead>Автор</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Дата обновления</TableHead>
                            <TableHead className="w-[100px]">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queue.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    Нет материалов, готовых к публикации.
                                </TableCell>
                            </TableRow>
                        ) : (
                            queue.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>
                                        {item.author?.first_name} {item.author?.last_name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'published' ? 'default' : 'outline'}>
                                            {item.status === 'published' ? 'Опубликовано' : 'Готово к публикации'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.updated_at).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/cms/publisher-editor/${item.id}`}>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
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