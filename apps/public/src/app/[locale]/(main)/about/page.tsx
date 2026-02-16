import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about' });
    return {
        title: t('meta_title'),
        description: t('meta_description'),
    };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about' });

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Hero Section */}
            <section className="max-w-4xl mb-24 md:mb-32">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] mb-8">
                    {t('hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
                    {t('hero_subtitle')}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    {t('hero_description')}
                </p>
            </section>

            {/* Image Placeholder */}
            <section className="mb-24 md:mb-32">
                <div className="relative w-full aspect-[21/9] bg-muted overflow-hidden rounded-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <span className="text-muted-foreground/30 text-lg">{t('visualization_text')}</span>
                    </div>
                </div>
            </section>

            {/* Grid Layout - Directions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-32 border-t border-border/40 pt-16">
                <div>
                    <h2 className="text-3xl font-medium mb-6">{t('directions_title')}</h2>
                    <p className="text-muted-foreground mb-4">
                        {t('directions_description')}
                    </p>
                </div>
                <div className="grid gap-10">
                    <div>
                        <h3 className="text-xl font-medium mb-2">{t('direction_present_title')}</h3>
                        <p className="text-muted-foreground">{t('direction_present_desc')}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium mb-2">{t('direction_future_title')}</h3>
                        <p className="text-muted-foreground">{t('direction_future_desc')}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium mb-2">{t('direction_people_title')}</h3>
                        <p className="text-muted-foreground">{t('direction_people_desc')}</p>
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-32 border-t border-border/40 pt-16">
                <div>
                    <h2 className="text-3xl font-medium mb-6">{t('culture_title')}</h2>
                </div>
                <div>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {t('culture_desc_1')}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {t('culture_desc_2')}
                    </p>
                </div>
            </section>


            {/* Mission & Journalism */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-32 border-t border-border/40 pt-16">
                <div>
                    <h2 className="text-3xl font-medium mb-6">{t('mission_title')}</h2>
                </div>
                <div>
                    <p className="text-lg font-medium text-foreground leading-relaxed mb-6">
                        {t('mission_desc_1')}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {t('mission_desc_2')}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {t('mission_desc_3')}
                    </p>
                </div>
            </section>
        </div>
    );
}
