'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerApi } from '@/lib/api'

export async function publishContent(id: number) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/publishing/content/${id}/publish`, {
            method: 'POST',
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось опубликовать материал' };
    }

    revalidatePath('/cms/publisher-editor');
    redirect('/cms/publisher-editor');
}

export async function unpublishContent(id: number) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/publishing/content/${id}/unpublish`, {
            method: 'POST',
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось снять с публикации' };
    }

    revalidatePath('/cms/publisher-editor');
    redirect('/cms/publisher-editor');
}

export async function scheduleContent(id: number, date: Date) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/publishing/content/${id}/schedule`, {
            method: 'POST',
            body: JSON.stringify({ scheduled_publish_at: date.toISOString() }),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось запланировать публикацию' };
    }

    revalidatePath('/cms/publisher-editor');
    redirect('/cms/publisher-editor');
}
