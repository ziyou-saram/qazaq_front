'use server'

import { getServerApi } from "@/lib/api";

export async function uploadMediaAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { error: "Файл не найден" };
    }

    try {
        const api = await getServerApi();
        // Use the public upload method we added to APIClient, but we need to ensure credentials are correct.
        // getServerApi sets the token automatically.
        // However, api.media.upload creates a NEW FormData. 
        // We can just reuse the file object.

        return await api.media.upload(file);
    } catch (error) {
        // Log the error for debugging
        console.error("Upload error:", error);

        if (error instanceof Error) {
            // Check for 403 specifically
            if (error.message.includes("403")) {
                return { error: "Нет прав на загрузку изображений (403). Проверьте активность аккаунта." };
            }
            return { error: error.message };
        }
        return { error: "Ошибка при загрузке файла" };
    }
}
