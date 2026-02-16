import Header from "@/components/layout/header";

import { cookies } from "next/headers";
import { api } from "@/lib/api";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    let user = null;

    if (token) {
        try {
            user = await api.auth.me(token);
        } catch (e) {
            // Token invalid or expired
        }
    }

    return (
        <main className="mx-auto max-w-384 min-h-screen flex flex-col gap-14 md:gap-16 lg:gap-28 px-4">
            <Header user={user} />
            {children}
        </main>
    );
}