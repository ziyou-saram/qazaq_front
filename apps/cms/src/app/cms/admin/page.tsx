import Link from "next/link";
import { Eye } from "lucide-react";
import { getServerApi } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserActions } from "./user-actions";
import { DeleteContentDialog } from "./content-actions"; // Import the delete dialog
import type { ContentListItem } from "@/lib/types";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface UserListResponse {
    items: User[];
    total: number;
    page: number;
    size: number;
}

interface ContentListResponse {
    items: ContentListItem[];
    total: number;
    skip: number;
    limit: number;
}

export default async function AdminDashboardPage() {
    const api = await getServerApi();

    // Fetch users
    let users: UserListResponse = { items: [], total: 0, page: 1, size: 20 };
    try {
        users = await api.request("/cms/admin/users");
    } catch (e) {
        console.error("Failed to fetch users", e);
    }

    // Fetch content
    let content: ContentListResponse = { items: [], total: 0, skip: 0, limit: 20 };
    try {
        content = await api.request("/cms/admin/content");
    } catch (e) {
        console.error("Failed to fetch content", e);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Панель администратора</h1>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">Пользователи</TabsTrigger>
                    <TabsTrigger value="content">Материалы</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Имя</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Роль</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Дата регистрации</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            Пользователи не найдены.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.items.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell className="font-medium">
                                                {user.first_name} {user.last_name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.is_active ? "default" : "destructive"}>
                                                    {user.is_active ? "Активен" : "Заблокирован"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString("ru-RU")}
                                            </TableCell>
                                            <TableCell>
                                                <UserActions user={user} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Заголовок</TableHead>
                                    <TableHead>Автор</TableHead>
                                    <TableHead>Тип</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Дата создания</TableHead>
                                    <TableHead className="w-[100px]">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {content.items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            Материалы не найдены.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    content.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium max-w-[300px] truncate" title={item.title}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell>
                                                {item.author?.first_name} {item.author?.last_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.type === "article" ? "Статья" : "Новость"}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{item.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.created_at).toLocaleDateString("ru-RU")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/cms/chief-editor/${item.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <DeleteContentDialog id={item.id} title={item.title} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}