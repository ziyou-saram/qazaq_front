"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/actions/auth";

const initialState = {
    error: '',
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [state, action, isPending] = useActionState(login, initialState);

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            action={action}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Войти в аккаунт</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Введите ваш email ниже, чтобы войти в аккаунт
                    </p>
                </div>
                {state?.error ? (
                    <Field>
                        <FieldDescription className="text-destructive text-center">
                            {state.error}
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Входим..." : "Войти"}
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
