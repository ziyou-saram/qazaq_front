"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Sidebar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api, resolveMediaUrl } from "@/lib/api";
import { clearAuthTokens, getAccessToken } from "@/lib/auth";
import type { UserResponse } from "@/lib/types";

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            return;
        }

        api.auth
            .me(token)
            .then(setUser)
            .catch(() => {
                clearAuthTokens();
                setUser(null);
            });
    }, []);

    const initials = useMemo(() => {
        if (!user) return "";
        const first = user.first_name?.[0] || "";
        const last = user.last_name?.[0] || "";
        return `${first}${last}`.toUpperCase();
    }, [user]);

    const avatarUrl = user?.avatar_url ? resolveMediaUrl(user.avatar_url) : null;
    const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "";

    const handleLogout = () => {
        clearAuthTokens();
        setUser(null);
        router.push("/login");
    };

    return (
        <header className="w-full bg-background">
            <div className="flex items-center-safe justify-between py-4">
                <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="object-contain" />

                <nav className="hidden lg:flex gap-6">
                    <Link href={"/"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Главная</Link>
                    <Link href={"/news"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Новости</Link>
                    <Link href={"/articles"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Статьи</Link>
                </nav>

                <div className="hidden lg:flex">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="focus-visible:outline-none">
                                    <Avatar>
                                        {avatarUrl ? <AvatarImage src={avatarUrl} alt={user.username} /> : null}
                                        <AvatarFallback>{initials || "U"}</AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{fullName || user.username}</span>
                                        <span className="text-muted-foreground text-xs">{user.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={handleLogout}>
                                    Выйти
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant={'secondary'} size={'lg'} className="rounded-full" asChild>
                            <Link href={"/login"}>Войти</Link>
                        </Button>
                    )}
                </div>

                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger>
                            <Sidebar className="size-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
                        </SheetTrigger>
                        <SheetContent side={'left'}>
                            <SheetHeader>
                                <SheetTitle>
                                    <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="object-contain" />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 h-full justify-center px-4">
                                <Link href={"/"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Главная</Link>
                                <Link href={"/news"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Новости</Link>
                                <Link href={"/articles"} className="text-muted-foreground hover:text-primary transition-colors duration-200">Статьи</Link>
                            </div>
                            <SheetFooter>
                                {user ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Avatar>
                                            {avatarUrl ? <AvatarImage src={avatarUrl} alt={user.username} /> : null}
                                            <AvatarFallback>{initials || "U"}</AvatarFallback>
                                        </Avatar>
                                        <Button variant={'secondary'} size={'lg'} className="rounded-full" onClick={handleLogout}>
                                            Выйти
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant={'secondary'} size={'lg'} className="rounded-full" asChild>
                                        <Link href={"/login"}>Войти</Link>
                                    </Button>
                                )}
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
