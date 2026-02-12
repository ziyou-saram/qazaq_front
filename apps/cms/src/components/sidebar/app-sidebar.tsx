"use client"

import * as React from "react"

import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import type { UserResponse } from "@/lib/types"

import {
    LifeBuoy,
    Send,
} from "lucide-react"

import {
    LayoutDashboard,
    FileEdit,
    CheckCircle,
    Globe,
    BookOpen,
    Users,
    MessageSquare,
    Settings,
} from "lucide-react";

const navSecondary = [
    {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
    },
    {
        title: "Feedback",
        url: "#",
        icon: Send,
    },
]

// Define navigation items
const NAV_ITEMS = {
    // Common items
    dashboard: {
        name: "Дашборд",
        url: "/cms/dashboard",
        icon: LayoutDashboard,
    },
    // Role specific items
    myContent: {
        name: "Мои материалы",
        url: "/cms/editor",
        icon: FileEdit,
    },
    reviewQueue: {
        name: "Очередь проверки",
        url: "/cms/chief-editor",
        icon: CheckCircle,
    },
    publishing: {
        name: "Публикация",
        url: "/cms/publisher-editor",
        icon: Globe,
    },
    docs: {
        name: "Документация",
        url: "/cms/docs",
        icon: BookOpen,
    },
    users: {
        name: "Пользователи",
        url: "/cms/admin",
        icon: Users,
    },
    comments: {
        name: "Комментарии",
        url: "/cms/moderator",
        icon: MessageSquare,
    },
    settings: {
        name: "Настройки",
        url: "/cms/settings",
        icon: Settings,
    }
};

// Define role access map
const ROLE_NAV_MAP: Record<string, (keyof typeof NAV_ITEMS)[]> = {
    user: ["dashboard", "docs"],
    editor: ["dashboard", "myContent", "docs"],
    chief_editor: ["dashboard", "reviewQueue", "myContent", "docs"], // Chief editors can also write
    publishing_editor: ["dashboard", "publishing", "docs"],
    moderator: ["dashboard", "docs"], // Comments removed temporarily
    admin: ["dashboard", "users", "settings", "reviewQueue", "publishing", "myContent", "docs"], // Admin sees everything
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: UserResponse;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const userDisplay = {
        name: `${user.first_name} ${user.last_name}`.trim() || user.username,
        email: user.email,
        avatar: user.avatar_url || "",
    }

    const allowedNavKeys = ROLE_NAV_MAP[user.role] || ["dashboard", "docs"];
    // Special check for Admin to ensure they have the role admin even if ROLE nav map misses it
    const finalNavKeys = user.role === 'admin' ?
        ["users", "dashboard", "reviewQueue", "publishing", "myContent", "docs"] as (keyof typeof NAV_ITEMS)[]
        : allowedNavKeys;

    const navItems = finalNavKeys.map(key => NAV_ITEMS[key]);

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <Image src="/logo.png" alt="Logo" width={100} height={100} />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={navItems} />
                <NavSecondary items={navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userDisplay} />
            </SidebarFooter>
        </Sidebar>
    )
}
