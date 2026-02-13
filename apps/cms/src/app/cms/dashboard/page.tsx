import { redirect } from "next/navigation";
import { FileText, CheckCircle, AlertCircle, Globe, Clock, Users } from "lucide-react";
import { getServerApi } from "@/lib/api";
import { StatsCard } from "@/components/dashboard/stats-card";

export default async function DashboardPage() {
    const api = await getServerApi();
    let user;
    let stats: any = {};

    try {
        user = await api.auth.me();

        // Fetch stats based on role
        if (user.role === 'editor' || user.role === 'admin') {
            try {
                const editorStats = await api.request("/cms/editor/dashboard");
                stats.editor = editorStats;
            } catch (e) {
                console.error("Failed to fetch editor stats", e);
            }
        }

        if (user.role === 'chief_editor' || user.role === 'admin') {
            try {
                const chiefStats = await api.request("/cms/chief-editor/dashboard");
                stats.chief = chiefStats;
            } catch (e) {
                console.error("Failed to fetch chief editor stats", e);
            }
        }

        if (user.role === 'publishing_editor' || user.role === 'admin') {
            try {
                const pubStats = await api.request("/cms/publishing/dashboard");
                stats.pub = pubStats;
            } catch (e) {
                console.error("Failed to fetch publishing stats", e);
            }
        }

    } catch (e) {
        redirect("/api/auth/logout");
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Editor Stats */}
                {(user.role === 'editor' || user.role === 'admin') && stats.editor && (
                    <>
                        <StatsCard
                            title="Черновики"
                            value={stats.editor.drafts}
                            icon={FileText}
                            description="В работе"
                        />
                        <StatsCard
                            title="На проверке"
                            value={stats.editor.in_review}
                            icon={Clock}
                            description="Ожидают проверки"
                        />
                        <StatsCard
                            title="Требуют правок"
                            value={stats.editor.needs_revision}
                            icon={AlertCircle}
                            description="Вернулись с замечаниями"
                        />
                        <StatsCard
                            title="Опубликовано"
                            value={stats.editor.published}
                            icon={Globe}
                            description="Ваши публикации"
                        />
                    </>
                )}

                {/* Chief Editor Stats */}
                {(user.role === 'chief_editor' || user.role === 'admin') && stats.chief && (
                    <>
                        <StatsCard
                            title="Очередь проверки"
                            value={stats.chief.in_review}
                            icon={Clock}
                            description="Статей ожидают решения"
                        />
                        <StatsCard
                            title="Одобрено"
                            value={stats.chief.approved}
                            icon={CheckCircle}
                            description="Готовы к публикации"
                        />
                        <StatsCard
                            title="На доработке"
                            value={stats.chief.needs_revision}
                            icon={AlertCircle}
                            description="Отправлены авторам"
                        />
                    </>
                )}

                {/* Publishing Editor Stats */}
                {(user.role === 'publishing_editor' || user.role === 'admin') && stats.pub && (
                    <>
                        <StatsCard
                            title="Ожидают публикации"
                            value={stats.pub.approved}
                            icon={CheckCircle}
                            description="Одобренные статьи"
                        />
                        <StatsCard
                            title="Запланировано"
                            value={stats.pub.scheduled}
                            icon={Clock}
                            description="Публикация по расписанию"
                        />
                        <StatsCard
                            title="Всего опубликовано"
                            value={stats.pub.published}
                            icon={Globe}
                            description="На сайте"
                        />
                    </>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <p>Здесь будет график активности</p>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <div className="flex items-center justify-between space-y-2">
                            <h3 className="tracking-tight text-sm font-medium">Недавняя активность</h3>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                            <p>Лента событий</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
