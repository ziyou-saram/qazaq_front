"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Category } from "@/lib/types";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";

// Define schema
const contentSchema = z.object({
    title: z.string().min(3, "Заголовок должен быть не менее 3 символов").max(500),
    excerpt: z.string().optional(),
    content: z.string().min(10, "Содержимое должно быть не менее 10 символов"),
    type: z.enum(["news", "article"]),
    language: z.enum(["ru", "kk", "en"]),
    // Simplification: allow any string, empty is valid. URL validation can be strict if needed but this fixes union type issues.
    cover_image_url: z.string().optional(),
    category_id: z.coerce.number().optional(),
});

export type ContentFormValues = z.infer<typeof contentSchema>;


interface ContentFormProps {
    defaultValues?: Partial<ContentFormValues>;
    onSubmit: (values: ContentFormValues) => Promise<any>;
    submitLabel?: string;
    accessToken?: string;
}

export function ContentForm({ defaultValues, onSubmit, submitLabel = "Сохранить", accessToken }: ContentFormProps) {
    const [isPending, startTransition] = useTransition();
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        if (accessToken) {
            api.setAccessToken(accessToken);
        }
        const fetchCategories = async () => {
            try {
                const response = await api.categories.getAll(0, 100);
                setCategories(response.items);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, [accessToken]);

    const form = useForm({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            language: "ru" as const,
            type: "article" as const,
            cover_image_url: "",
            category_id: undefined,
            ...defaultValues,
        },
    });

    const handleSubmit = (values: z.infer<typeof contentSchema>) => {
        startTransition(async () => {
            await onSubmit(values);
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Заголовок</FormLabel>
                                <FormControl>
                                    <Input placeholder="Введите заголовок..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Тип публикации</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите тип" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="article">Статья</SelectItem>
                                        <SelectItem value="news">Новость</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Язык контента</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите язык" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ru">Русский (Ru)</SelectItem>
                                        <SelectItem value="kk">Қазақша (Kk)</SelectItem>
                                        <SelectItem value="en">English (En)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Категория</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange((value && value !== "0") ? parseInt(value) : undefined)}
                                    defaultValue={field.value?.toString() || "0"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите категорию" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Без категории</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cover_image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Обложка</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Краткое описание (Lead)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Краткое содержание..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Содержание</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
