import Header from "@/components/layout/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="mx-auto max-w-384 min-h-screen flex flex-col gap-14 md:gap-16 lg:gap-28 px-4">
            <Header />
            {children}
        </main>
    );
}