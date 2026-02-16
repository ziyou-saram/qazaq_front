"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();

    const languages = [
        { code: "ru", label: "Русский" },
        { code: "kk", label: "Қазақша" },
        { code: "en", label: "English" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} asChild>
                        <Link href={pathname} locale={lang.code} className={locale === lang.code ? "font-bold" : ""}>
                            {lang.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
