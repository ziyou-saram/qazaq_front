'use client';

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { updateUserRole, updateUserStatus } from "@/actions/admin";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
}

interface UserActionsProps {
    user: User;
}

const ROLES = [
    { value: "user", label: "User" },
    { value: "editor", label: "Editor" },
    { value: "chief_editor", label: "Chief Editor" },
    { value: "publishing_editor", label: "Publishing Editor" },
    { value: "moderator", label: "Moderator" },
    { value: "admin", label: "Admin" },
];

export function UserActions({ user }: UserActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (newRole: string) => {
        startTransition(async () => {
            const result = await updateUserRole(user.id, newRole);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`Роль пользователя обновлена на ${newRole}`);
            }
        });
    };

    const handleStatusChange = () => {
        const newStatus = !user.is_active;
        startTransition(async () => {
            const result = await updateUserStatus(user.id, newStatus);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`Пользователь ${newStatus ? 'активирован' : 'деактивирован'}`);
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Открыть меню</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                    Копировать Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Сменить роль</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={user.role} onValueChange={handleRoleChange}>
                            {ROLES.map((role) => (
                                <DropdownMenuRadioItem key={role.value} value={role.value}>
                                    {role.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={handleStatusChange}>
                    {user.is_active ? "Деактивировать" : "Активировать"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
