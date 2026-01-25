"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { approveContent, requestRevision } from "@/actions/review";

interface ReviewProps {
    contentId: number;
}

export function ApproveButton({ contentId }: ReviewProps) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            try {
                const result = await approveContent(contentId);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Материал одобрен и опубликован");
                }
            } catch (error) {
                toast.error("Произошла ошибка при одобрении");
            }
        });
    };

    return (
        <form action={handleApprove}>
            <Button
                type="submit"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                disabled={isPending}
            >
                {isPending ? "Одобряем..." : "Одобрить и опубликовать"}
            </Button>
        </form>
    );
}

export function RevisionCard({ contentId }: ReviewProps) {
    const [isPending, startTransition] = useTransition();

    const handleRevision = (formData: FormData) => {
        startTransition(async () => {
            try {
                const result = await requestRevision(contentId, formData);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Материал отправлен на доработку");
                }
            } catch (error) {
                toast.error("Произошла ошибка при отправке");
            }
        });
    };

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle>Вернуть на доработку</CardTitle>
                <CardDescription>
                    Если материал требует исправлений, укажите комментарий для автора.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleRevision} id="revision-form" className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="comment">Комментарий</Label>
                        <Textarea
                            id="comment"
                            name="comment"
                            placeholder="Что нужно исправить?"
                            required
                            className="min-h-[150px]"
                            disabled={isPending}
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    type="submit"
                    variant="destructive"
                    form="revision-form"
                    className="w-full"
                    disabled={isPending}
                >
                    {isPending ? "Отправляем..." : "Отправить на доработку"}
                </Button>
            </CardFooter>
        </Card>
    );
}
