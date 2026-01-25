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

export function SignupForm({
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
        const firstName = String(formData.get("first_name") || "");
        const lastName = String(formData.get("last_name") || "");
        const username = String(formData.get("username") || "");
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const confirmPassword = String(formData.get("confirm_password") || "");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают.");
            setLoading(false);
            return;
        }

        try {
            await api.auth.register({
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            });
            const tokens = await api.auth.login({ email, password });
            setAuthTokens(tokens);
            router.push("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка регистрации";
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
                    <h1 className="text-2xl font-bold">Создайте аккаунт</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Заполните форму ниже, чтобы создать аккаунт
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
                    <FieldLabel htmlFor="first_name">Имя</FieldLabel>
                    <Input id="first_name" name="first_name" type="text" placeholder="Айсұлу" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="last_name">Фамилия</FieldLabel>
                    <Input id="last_name" name="last_name" type="text" placeholder="Баймуханова" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
                    <Input id="username" name="username" type="text" placeholder="johndoe" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    <FieldDescription>
                        Мы используем email для связи с вами. Мы не делаем разглашения email
                        с кем-либо еще.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input id="password" name="password" type="password" required />
                    <FieldDescription>
                        Должен быть не менее 8 символов.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">Подтвердите пароль</FieldLabel>
                    <Input id="confirm-password" name="confirm_password" type="password" required />
                    <FieldDescription>Подтвердите ваш пароль.</FieldDescription>
                </Field>
                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Создаём..." : "Создать аккаунт"}
                    </Button>
                </Field>
                <Field>
                    <FieldDescription className="px-6 text-center">
                        У вас уже есть аккаунт? <a href="/login">Войти</a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
