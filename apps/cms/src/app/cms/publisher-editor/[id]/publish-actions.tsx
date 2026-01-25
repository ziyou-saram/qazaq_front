'use client';

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishContent, unpublishContent } from "@/actions/publish";

interface PublishActionsProps {
    id: number;
    isPublished: boolean;
}

export function PublishActions({ id, isPublished }: PublishActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handlePublish = () => {
        startTransition(async () => {
            const result = await publishContent(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Материал опубликован");
            }
        });
    };

    const handleUnpublish = () => {
        startTransition(async () => {
            const result = await unpublishContent(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Материал снят с публикации");
            }
        });
    };

    if (isPublished) {
        return (
            <Button
                variant="destructive"
                onClick={handleUnpublish}
                disabled={isPending}
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Снять с публикации
            </Button>
        );
    }

    return (
        <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={handlePublish}
            disabled={isPending}
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Опубликовать сейчас
        </Button>
    );
}
