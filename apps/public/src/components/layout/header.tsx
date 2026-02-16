"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { Sidebar, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import type { UserResponse, Category } from "@/lib/types";
import { SearchBar } from "@/components/layout/search-bar";
import { deleteAuthCookie } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/components/common/language-switcher";

export default function Header({ user: initialUser }: { user?: UserResponse | null }) {
    const t = useTranslations('nav');
    const tAuth = useTranslations('auth');
    const tCats = useTranslations('categories');
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(initialUser || null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Only fetch if we don't have user yet but have token (e.g. client navigation)
        // If we have initialUser (SSR), we skip this to avoid flash.
        if (!user) {
            const token = getAccessToken();
            if (token) {
                api.auth.me(token)
                    .then(setUser)
                    .catch(() => {
                        clearAuthTokens();
                        setUser(null);
                    });
            }
        }

        // Fetch Categories
        api.public.getCategories({ has_content: true })
            .then(res => setCategories(res.items))
            .catch(console.error);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const initials = useMemo(() => {
        if (!user) return "";
        const first = user.first_name?.[0] || "";
        const last = user.last_name?.[0] || "";
        return `${first}${last}`.toUpperCase();
    }, [user]);

    const avatarUrl = user?.avatar_url ? resolveMediaUrl(user.avatar_url) : null;
    const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "";

    const handleLogout = async () => {
        clearAuthTokens();
        await deleteAuthCookie();
        setUser(null);
        router.push("/login");
    };

    return (
        <header className="w-full bg-background border-b border-primary/40 pb-2">
            <div className="flex items-center-safe justify-between py-4 container mx-auto px-4">
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <Image src={"/logo.png"} alt="Logo" width={120} height={40} className="object-contain" />
                    </Link>

                    <nav className="hidden lg:flex gap-6">
                        <Link href={"/"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('home')}</Link>
                        <Link href={"/news"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('news')}</Link>
                        <Link href={"/articles"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('articles')}</Link>

                        {categories.slice(0, 5).map(cat => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-nowrap"
                            >
                                {tCats.has(cat.slug) ? tCats(cat.slug) : cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    {/* <div className="hidden lg:block w-64">
                        <SearchBar />
                    </div> */}
                    <Link href={"/search"}>
                        <Button variant={'secondary'} className="rounded-full" size={'icon'}>
                            <Search className="w-5 h-5" />
                        </Button>
                    </Link>

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
                                        {tAuth('logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant={'secondary'} size={'lg'} className="rounded-full" asChild>
                                <Link href={"/login"}>{tAuth('login')}</Link>
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
                                <div className="flex flex-col gap-4 h-full pt-8 px-4">
                                    <SearchBar />
                                    <Link href={"/"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('home')}</Link>
                                    <Link href={"/news"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('news')}</Link>
                                    <Link href={"/articles"} className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('articles')}</Link>

                                    <div className="py-2">
                                        <h4 className="mb-2 text-sm font-semibold">{t('categories')}</h4>
                                        <div className="flex flex-col gap-2 pl-4">
                                            {categories.map(cat => (
                                                <Link key={cat.id} href={`/category/${cat.slug}`} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                                                    {tCats.has(cat.slug) ? tCats(cat.slug) : cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className="absolute bottom-4 left-4 right-4">
                                    {user ? (
                                        <div className="flex flex-col items-center gap-3 w-full">
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={user.username} /> : null}
                                                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{fullName}</span>
                                                </div>
                                            </div>
                                            <Button variant={'secondary'} size={'lg'} className="rounded-full w-full" onClick={handleLogout}>
                                                {tAuth('logout')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant={'secondary'} size={'lg'} className="rounded-full w-full" asChild>
                                            <Link href={"/login"}>{tAuth('login')}</Link>
                                        </Button>
                                    )}
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
