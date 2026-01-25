import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-background">
            <div className="flex items-center-safe justify-center py-4">
                <Image src={"/logo.png"} alt="Logo" width={180} height={180} className="object-contain" />
            </div>
        </footer>
    );
}