'use client'

import { logoutAction } from "@/app/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
    const handleLogout = async () => {
        await logoutAction();
    };

    return (
        <DropdownMenuItem onClick={handleLogout}>
            Выйти
        </DropdownMenuItem>
    );
}
