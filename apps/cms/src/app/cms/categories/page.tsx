import CategoriesClient from "./categories-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Категории | Qazaq CMS",
    description: "Управление категориями контента",
};

export default async function CategoriesPage() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    return <CategoriesClient accessToken={token} />;
}
