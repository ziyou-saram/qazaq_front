"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Eye,
    Pencil,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pin,
    PinOff,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContentListItem } from "@/lib/types";

interface ContentTableProps {
    data: {
        items: ContentListItem[];
        total: number;
        skip: number;
        limit: number;
    };
    baseUrl: string;
    isChiefEditor?: boolean;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Черновик", variant: "secondary" },
    in_review: { label: "На проверке", variant: "default" },
    needs_revision: { label: "Требует правок", variant: "destructive" },
    approved: { label: "Одобрено", variant: "outline" },
    published: { label: "Опубликовано", variant: "default" },
};

export function ContentTable({ data, baseUrl, isChiefEditor = false }: ContentTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    // Pagination handlers
    const currentPage = Math.floor(data.skip / data.limit) + 1;
    const totalPages = Math.ceil(data.total / data.limit);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        params.set("skip", "0"); // Reset to first page
        router.push(`${baseUrl}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        const newSkip = (newPage - 1) * data.limit;
        params.set("skip", newSkip.toString());
        router.push(`${baseUrl}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск по заголовку..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Найти</Button>
                </form>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Заголовок</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Статус</TableHead>
                            {isChiefEditor && <TableHead>Автор</TableHead>}
                            <TableHead>Дата обновления</TableHead>
                            <TableHead className="w-[80px]">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isChiefEditor ? 6 : 5} className="text-center h-32 text-muted-foreground">
                                    Ничего не найдено
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {item.is_pinned && <Pin className="h-4 w-4 text-primary rotate-45" />}
                                            <div className="truncate max-w-[300px]" title={item.title}>
                                                {item.title}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.type === "article" ? "Статья" : "Новость"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusMap[item.status]?.variant || "outline"}>
                                            {statusMap[item.status]?.label || item.status}
                                        </Badge>
                                    </TableCell>
                                    {isChiefEditor && (
                                        <TableCell>
                                            {item.author?.first_name} {item.author?.last_name}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {new Date(item.updated_at).toLocaleDateString("ru-RU", {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`${baseUrl}/${item.id}`} className="flex items-center cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Редактировать
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`${baseUrl}/${item.id}`} className="flex items-center cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Просмотр
                                                    </Link>
                                                </DropdownMenuItem>
                                                {isChiefEditor && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={async () => {
                                                                try {
                                                                    if (item.is_pinned) {
                                                                        await api.content.unpin(item.id);
                                                                    } else {
                                                                        await api.content.pin(item.id);
                                                                    }
                                                                    router.refresh();
                                                                } catch (error) {
                                                                    console.error("Failed to toggle pin", error);
                                                                }
                                                            }}
                                                        >
                                                            {item.is_pinned ? (
                                                                <>
                                                                    <PinOff className="mr-2 h-4 w-4" />
                                                                    Открепить
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Pin className="mr-2 h-4 w-4" />
                                                                    Закрепить
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Страница {currentPage} из {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Вперед <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
