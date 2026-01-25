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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string>("");

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

        if (!role) {
            setError("Выберите роль.");
            setLoading(false);
            return;
        }

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
                role: role as "editor" | "chief_editor" | "publishing_editor" | "moderator" | "user",
            });
            const tokens = await api.auth.login({ email, password });
            setAuthTokens(tokens);
            router.push("/cms");
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
                    <h1 className="text-2xl font-bold">Создание аккаунта</h1>
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
                    <Input id="first_name" name="first_name" type="text" placeholder="Айдана" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="last_name">Фамилия</FieldLabel>
                    <Input id="last_name" name="last_name" type="text" placeholder="Серикова" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
                    <Input id="username" name="username" type="text" placeholder="editor01" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    <FieldDescription>
                        Мы используем ваш email для связи с вами. Мы не делаем обмен вашим email
                        с кем-либо еще.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="role">Роль</FieldLabel>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="editor">Редактор</SelectItem>
                                <SelectItem value="chief_editor">Главный редактор</SelectItem>
                                <SelectItem value="publishing_editor">Публикующий редактор</SelectItem>
                                <SelectItem value="moderator">Модератор</SelectItem>
                                <SelectItem value="user">Пользователь</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input id="password" name="password" type="password" required />
                    <FieldDescription>
                        Должен содержать не менее 8 символов.
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
                        Уже есть аккаунт? <a href="/login">Войти</a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
