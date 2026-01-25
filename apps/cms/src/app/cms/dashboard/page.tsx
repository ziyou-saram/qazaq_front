import { redirect } from "next/navigation";
import { getServerApi } from "@/lib/api";

export default async function DashboardPage() {
    const api = await getServerApi();
    let user;

    try {
        user = await api.auth.me();
    } catch (e) {
        redirect("/api/auth/logout");
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50 p-6">
                    <h3 className="text-xl font-bold">Добро пожаловать, {user.first_name}!</h3>
                    <p className="text-muted-foreground">Это ваша панель управления CMS.</p>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    );
}
