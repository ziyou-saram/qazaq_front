import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'copyright' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function CopyrightPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'copyright' });

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">{t('h1')}</h1>

                <div className="prose prose-lg dark:prose-invert prose-headings:font-medium text-muted-foreground">
                    <p>{t('p1')}</p>
                    <p>{t('p2')}</p>
                    <p>{t('p3')}</p>

                    <h3 className="text-foreground">{t('h3_forbidden')}</h3>
                    <ul>
                        <li>{t('li1')}</li>
                        <li>{t('li2')}</li>
                        <li>{t('li3')}</li>
                    </ul>

                    <p>{t('p4')}</p>
                    <p>{t('p5')}</p>

                    <p className="border-t pt-8 mt-12 text-sm text-foreground/60">
                        {t('footer_rights')}
                    </p>
                </div>
            </div>
        </div>
    );
}
