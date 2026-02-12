import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadDocsContent() {
    const candidates = [
        path.resolve(process.cwd(), "README_CMS.md"),
        path.resolve(process.cwd(), "../README_CMS.md"),
        path.resolve(process.cwd(), "../../README_CMS.md"),
        path.resolve(process.cwd(), "../../../README_CMS.md"),
    ];

    for (const filePath of candidates) {
        try {
            const content = await readFile(filePath, "utf-8");
            return { content, filePath };
        } catch {
            // Try next candidate.
        }
    }

    return {
        content: "Документация не найдена. Добавьте README_CMS.md в корень проекта.",
        filePath: null,
    };
}

export default async function DocsPage() {
    const { content, filePath } = await loadDocsContent();

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Документация CMS</h1>
                <p className="text-sm text-muted-foreground">
                    {filePath
                        ? `Источник: ${filePath}`
                        : "Проверьте наличие README_CMS.md в проекте."}
                </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6">{content}</pre>
            </div>
        </div>
    );
}
