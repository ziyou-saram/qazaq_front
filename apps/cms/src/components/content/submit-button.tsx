"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitForReview } from "@/actions/submit-review";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    contentId: number;
    status: string;
}

export function SubmitForReviewButton({ contentId, status }: SubmitButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            try {
                const result = await submitForReview(contentId);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Материал отправлен на проверку");
                }
            } catch (error) {
                toast.error("Не удалось отправить на проверку");
            }
        });
    };

    return (
        <Button
            onClick={handleClick}
            variant="default"
            disabled={isPending}
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "needs_revision" ? "Отправить повторно" : "Отправить на проверку"}
        </Button>
    );
}
