"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
    categories: Category[];
}

export default function SearchFilters({ categories }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get("q") || "";
    const initialCategorySlug = searchParams.get("category");

    const [query, setQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategorySlug);

    // Update state when URL changes (e.g. back button)
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
        setSelectedCategory(searchParams.get("category"));
    }, [searchParams]);

    const handleSearch = (newQuery: string, newCategory: string | null) => {
        const params = new URLSearchParams();
        if (newQuery) params.set("q", newQuery);
        if (newCategory) params.set("category", newCategory);
        router.push(`/search?${params.toString()}`);
    };

    const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const submitSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        handleSearch(query, selectedCategory);
    };

    const toggleCategory = (slug: string) => {
        const newCategory = selectedCategory === slug ? null : slug;
        setSelectedCategory(newCategory);
        handleSearch(query, newCategory);
    };

    const resetFilters = () => {
        setQuery("");
        setSelectedCategory(null);
        router.push("/search");
    };

    return (
        <div className="flex flex-col gap-6 mb-8">
            <form onSubmit={submitSearch} className="flex gap-2 w-full max-w-2xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Поиск по сайту..."
                        className="pl-9 w-full rounded-none shadow-none border-foreground focus-visible:ring-0 focus-visible:border-primary"
                        value={query}
                        onChange={onQueryChange}
                    />
                </div>
                <Button type="submit" className="rounded-none shadow-none font-bold uppercase tracking-widest">
                    Найти
                </Button>
            </form>

            <div className="flex flex-col items-center gap-3">
                <div className="flex overflow-x-auto gap-2 w-full pb-2 md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <Button
                        variant={!selectedCategory ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                            setSelectedCategory(null);
                            handleSearch(query, null);
                        }}
                        className="rounded-none shadow-none font-bold uppercase tracking-widest text-[10px] shrink-0"
                    >
                        Все
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.slug ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleCategory(cat.slug)}
                            className="rounded-none shadow-none font-bold uppercase tracking-widest text-[10px] shrink-0"
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {(query || selectedCategory) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-muted-foreground hover:text-destructive gap-1 shadow-none rounded-none font-bold uppercase tracking-widest text-[10px]"
                    >
                        <X className="h-3 w-3" />
                        Сбросить фильтры
                    </Button>
                )}
            </div>
        </div>
    );
}
