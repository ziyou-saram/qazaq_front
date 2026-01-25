import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid h-screen md:grid-cols-2 gap-4 md:gap-6">
      <div className="flex flex-col justify-between p-4 md:p-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="object-contain"
          priority
        />

        <div className="grid gap-2 md:gap-2.5 lg:gap-3">
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl lg:text-6xl">Добро пожаловать в CMS</h1>
          <p className="text-muted-foreground">Система управления контентом</p>
          <div className="flex flex-col items-center-safe gap-2 md:flex-row">
            <Button className="rounded-full w-full md:w-fit" asChild>
              <Link href={"/login"}>Войти</Link>
            </Button>
            <Button className="rounded-full w-full md:w-fit" variant={'secondary'} asChild>
              <Link href={"/signup"}>Зарегистрироваться</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative lg:h-screen w-full">
        <Image
          src="https://images.unsplash.com/photo-1768361435257-819e2c22f0b4?q=80&w=1313&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>
    </div>
  );
}