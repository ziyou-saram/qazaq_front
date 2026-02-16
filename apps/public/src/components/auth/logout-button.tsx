'use client'

import { deleteAuthCookie } from "@/app/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { clearAuthTokens } from "@/lib/auth";

export function LogoutButton() {
    const t = useTranslations('auth');
    const router = useRouter();

    const handleLogout = async () => {
        clearAuthTokens();
        await deleteAuthCookie();
        router.push('/login');
        router.refresh();
    };

    return (
        <DropdownMenuItem onClick={handleLogout}>
            {t('logout')}
        </DropdownMenuItem>
    );
}
