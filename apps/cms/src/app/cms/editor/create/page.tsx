"use client";

import { toast } from "sonner";
import { ContentForm } from "@/components/content/content-form";
import { createArticle } from "@/actions/articles";

export default function CreateContentPage() {
    const handleSubmit = async (values: any) => {
        const result = await createArticle(values);
        if (result?.error) {
            toast.error(result.error);
        }
    };

    return (
        <div className="w-full p-4 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Создание материала</h1>
                <p className="text-muted-foreground">
                    Напишите новость или статью. Вы сможете сохранить ее как черновик.
                </p>
            </div>

            <ContentForm onSubmit={handleSubmit} submitLabel="Создать черновик" />
        </div>
    );
}
