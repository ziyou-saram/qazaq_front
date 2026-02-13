'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginResult {
    success: boolean;
    error?: string;
}

interface SignupResult {
    success: boolean;
    error?: string;
}

/**
 * Server Action for user login
 */
export async function loginAction(
    email: string,
    password: string
): Promise<LoginResult> {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // Important: send/receive cookies
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Login failed' }));
            return {
                success: false,
                error: error.detail || 'Invalid email or password',
            };
        }

        // Cookies are set automatically by the backend
        await response.json();

        // Redirect to home page after successful login
        redirect('/');
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error && error.message === 'NEXT_REDIRECT') {
            throw error; // Re-throw redirect errors
        }

        return {
            success: false,
            error: 'An error occurred during login',
        };
    }
}

/**
 * Server Action for user signup
 */
export async function signupAction(userData: {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
}): Promise<SignupResult> {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include', // Important: send/receive cookies
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
            return {
                success: false,
                error: error.detail || 'Registration failed',
            };
        }

        // Cookies are set automatically by the backend
        await response.json();

        // Redirect to home page after successful signup
        redirect('/');
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error && error.message === 'NEXT_REDIRECT') {
            throw error; // Re-throw redirect errors
        }

        return {
            success: false,
            error: 'An error occurred during registration',
        };
    }
}

/**
 * Server Action for user logout
 */
export async function logoutAction(): Promise<void> {
    try {
        // Call backend to clear cookies
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear cookies on the client side as well (belt and suspenders)
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    // Redirect to login page
    redirect('/login');
}
