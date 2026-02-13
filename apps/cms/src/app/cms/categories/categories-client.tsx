"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2, FolderTree } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface CategoriesClientProps {
    accessToken?: string;
}

export default function CategoriesClient({ accessToken }: CategoriesClientProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form states
    const [formData, setFormData] = useState<CategoryCreate>({
        name: "",
        description: "",
        order: 0,
    });
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await api.categories.getAll();
            setCategories(response.items);
        } catch (error) {
            console.error(error);
            toast.error("Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (accessToken) {
            api.setAccessToken(accessToken);
        }
        fetchCategories();
    }, [accessToken]);

    const handleCreate = async () => {
        setSaving(true);
        try {
            await api.categories.create(formData);
            toast.success("Категория создана");
            setIsCreateOpen(false);
            setFormData({ name: "", description: "", order: 0 });
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при создании категории");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedCategory) return;
        setSaving(true);
        try {
            await api.categories.update(selectedCategory.id, {
                name: formData.name,
                description: formData.description,
                order: formData.order,
            });
            toast.success("Категория обновлена");
            setIsEditOpen(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при обновлении категории");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        setSaving(true);
        try {
            await api.categories.delete(selectedCategory.id);
            toast.success("Категория удалена");
            setIsDeleteOpen(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при удалении категории");
        } finally {
            setSaving(false);
        }
    };

    const openEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            order: category.order,
        });
        setIsEditOpen(true);
    };

    const openDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Категории</h1>
                    <p className="text-muted-foreground">
                        Управление рубриками и категориями контента
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Добавить категорию
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Новая категория</DialogTitle>
                            <DialogDescription>
                                Создайте новую категорию для группировки контента.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Название</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Например: Политика"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Краткое описание категории"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Порядок сортировки (опционально)</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order || ""}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    placeholder="Автоматически (в конец списка)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Оставьте пустым для автоматического добавления в конец списка.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Отмена
                            </Button>
                            <Button onClick={handleCreate} disabled={saving || !formData.name}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Создать
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Список категорий</CardTitle>
                    <CardDescription>Всего категорий: {categories.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Название</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Описание</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        Категорий пока нет. Создайте первую!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.order}</TableCell>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <FolderTree className="w-4 h-4 text-muted-foreground" />
                                            {category.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell className="max-w-[300px] truncate">
                                            {category.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDelete(category)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать категорию</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Название</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Описание</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-order">Порядок</Label>
                            <Input
                                id="edit-order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleUpdate} disabled={saving || !formData.name}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Сохранить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Вы уверены, что хотите удалить категорию "<strong>{selectedCategory?.name}</strong>"?
                            Это действие нельзя отменить. Контент в этой категории останется без категории.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Удалить
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
