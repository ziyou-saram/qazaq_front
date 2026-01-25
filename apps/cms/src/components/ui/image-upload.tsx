"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMediaAction } from "@/actions/media";
import { resolveMediaUrl } from "@/lib/api";
import { toast } from "sonner";

// ... (imports remain)


interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await uploadMediaAction(formData);

            if ('error' in response && response.error) {
                toast.error(response.error as string);
            } else if ('url' in response) {
                onChange((response as { url: string }).url);
                toast.success("Изображение загружено");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка загрузки изображения");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const imageUrl = resolveMediaUrl(value);

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={disabled || isUploading}
            />

            {value ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                    <Image
                        src={imageUrl || value} // Fallback to value if resolve fails
                        alt="Upload"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        onClick={handleRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={triggerUpload}
                    className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                        {isUploading ? "Загрузка..." : "Нажмите для загрузки"}
                    </span>
                </div>
            )}
        </div>
    );
}
