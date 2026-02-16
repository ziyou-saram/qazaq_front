"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api";
import { setAuthTokens } from "@/lib/auth";
import { setAuthCookie } from "@/app/actions/auth";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        try {
            const tokens = await api.auth.login({ email, password });
            setAuthTokens(tokens);
            await setAuthCookie(tokens.access_token);
            router.push("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка входа";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Войдите в аккаунт</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Введите ваш email ниже, чтобы войти в аккаунт
                    </p>
                </div>
                {error ? (
                    <Field>
                        <FieldDescription className="text-destructive text-center">
                            {error}
                        </FieldDescription>
                    </Field>
                ) : null}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Пароль</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Забыли пароль?
                        </a>
                    </div>
                    <Input id="password" name="password" type="password" required />
                </Field>
                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Входим..." : "Войти"}
                    </Button>
                </Field>
                <Field>
                    <FieldDescription className="text-center">
                        Нет аккаунта?{" "}
                        <a href="/signup" className="underline underline-offset-4">
                            Зарегистрироваться
                        </a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
