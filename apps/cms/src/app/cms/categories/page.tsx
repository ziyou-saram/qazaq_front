import CategoriesClient from "./categories-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Категории | Qazaq CMS",
    description: "Управление категориями контента",
};

export default function CategoriesPage() {
    return <CategoriesClient />;
}
