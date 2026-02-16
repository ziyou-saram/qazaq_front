"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "access_token";

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function deleteAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}
