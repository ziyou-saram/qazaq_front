'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerApi } from '@/lib/api'
import { ContentFormValues } from '@/components/content/content-form'

export async function createArticle(data: ContentFormValues) {
    const api = await getServerApi();

    try {
        await api.request('/cms/editor/content', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось создать статью' };
    }

    revalidatePath('/cms/editor');
    redirect('/cms/editor');
}

export async function updateArticle(id: number, data: ContentFormValues) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/editor/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось обновить статью' };
    }

    revalidatePath('/cms/editor');
    revalidatePath(`/cms/editor/${id}`);
    redirect('/cms/editor');
}
