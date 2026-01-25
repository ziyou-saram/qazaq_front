'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerApi } from '@/lib/api'

export async function submitForReview(id: number) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/editor/content/${id}/submit`, {
            method: 'POST',
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось отправить на проверку' };
    }

    revalidatePath('/cms/editor');
    revalidatePath(`/cms/editor/${id}`);
    redirect('/cms/editor');
}
