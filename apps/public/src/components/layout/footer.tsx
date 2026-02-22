import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

// Custom Icons for those missing in Lucide
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.863 1.13c-1.11.432-1.64.638-1.571 1.096.068.459.713.88 1.942 1.325.684.248 1.488.54 2.37.892.42.168.84.342 1.258.528l1.09-1.09c.2-.2.51-.2.71 0s.2.51 0 .71l-1.39 1.39.02.015c1.693.682 3.827 1.535 4.88 1.956.76.305 1.543.102 1.884-.81.674-1.802 2.593-7.237 3.633-10.274.52-1.52.3-2.22-.518-2.617z" />
        <path d="M9.4 11.23L8.62 17.18c-.01.076.04.145.11.164.21.056.88.237 1.23.332l2.67-2.67" />
    </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 10V9a.5.5 0 0 0-1 1" /> {/* Simplified phone path inside or just bubble */}
        <path d="M9 10a.5.5 0 0 1 0 1" />
        {/* Using a cleaner path for WhatsApp logo */}
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.07 1C5.51 1 .154 6.379.15 12.95c0 2.107.546 4.161 1.588 5.966L0 23l4.204-1.102a11.9 11.9 0 0 0 5.614 2.225l.004.001h.248h.003c6.559 0 11.917-5.378 11.917-11.937a11.8 11.8 0 0 0-3.53-8.401z" />
    </svg>
);

const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2a10 10 0 1 0 10 10c0-1.5-.7-2.8-2-3.4-2.6-1.2-5.7.5-6.5 3-.2.8 0 1.6.5 2.2.5.6 1.4.6 2.1.2 2-1.1 1.4-4.5-1.5-4.5-5.3 0-8 6.5-3.4 9.8 1.4 1 3.5 1.3 5.3.5" />
    </svg>
);


export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const tCats = useTranslations('categories');

    // Helper for category links - matching what we have in messages or generic
    // Since categories are dynamic, we might ideally fetch them, but for Footer 
    // we often have a static set of "popular" categories or just links.
    // The previous footer had hardcoded links: IT, Politics, Sport, Economics, Technology.
    // We will assume these are the main ones and translate their display names.

    return (
        <footer className="w-full bg-background border-t-[6px] border-t-foreground pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-24">
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold uppercase tracking-widest text-[11px] text-foreground">{t('sections')}</h4>
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tNav('home')}</Link>
                        <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tNav('news')}</Link>
                        <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tNav('articles')}</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold uppercase tracking-widest text-[11px] text-foreground">{t('categories')}</h4>
                        <Link href="/category/it" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCats('it')}</Link>
                        <Link href="/category/politics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCats('politics')}</Link>
                        <Link href="/category/sport" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCats('sport')}</Link>
                        <Link href="/category/economics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCats('economics')}</Link>
                        <Link href="/category/technology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCats('technology')}</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold uppercase tracking-widest text-[11px] text-foreground">{t('about')}</h4>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('about_project')}</Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('contacts')}</Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('privacy')}</Link>
                        <Link href="/copyright" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('copyright')}</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold uppercase tracking-widest text-[11px] text-foreground">{t('socials')}</h4>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Facebook</a>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Telegram</a>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Threads</a>
                        <a href="#" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/40">
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-muted-foreground">Qazaq News © 2024–2026</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <WhatsappIcon className="w-5 h-5" />
                        </a> */}
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a> */}
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a> */}
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <TelegramIcon className="w-5 h-5" />
                        </a> */}
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ThreadsIcon className="w-5 h-5" />
                        </a> */}
                        {/* <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Youtube className="w-5 h-5" />
                        </a> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}