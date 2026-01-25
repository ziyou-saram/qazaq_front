'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerApi } from '@/lib/api'

export async function approveContent(id: number) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/chief-editor/content/${id}/approve`, {
            method: 'POST',
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось одобрить материал' };
    }

    revalidatePath('/cms/chief-editor');
    redirect('/cms/chief-editor');
}

export async function requestRevision(id: number, formData: FormData) {
    const api = await getServerApi();
    const comment = formData.get('comment') as string;

    if (!comment) {
        return { error: 'Необходимо указать комментарий' };
    }

    try {
        await api.request(`/cms/chief-editor/content/${id}/request-revision`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось отправить на доработку' };
    }

    revalidatePath('/cms/chief-editor');
    redirect('/cms/chief-editor');
}
