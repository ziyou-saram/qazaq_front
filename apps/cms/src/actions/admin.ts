'use server'

import { revalidatePath } from 'next/cache'
import { getServerApi } from '@/lib/api'

export async function updateUserRole(userId: number, role: string) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось обновить роль пользователя' };
    }

    revalidatePath('/cms/admin');
}

export async function updateUserStatus(userId: number, isActive: boolean) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/admin/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ is_active: isActive }),
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось обновить статус пользователя' };
    }

    revalidatePath('/cms/admin');
}

export async function deleteContent(id: number) {
    const api = await getServerApi();

    try {
        await api.request(`/cms/admin/content/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Не удалось удалить материал' };
    }

    revalidatePath('/cms/admin');
    return { success: true };
}
