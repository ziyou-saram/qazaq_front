export function getAccessToken() {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return match ? match[2] : undefined;
}

export function setAuthTokens(tokens: { access_token: string; refresh_token: string }) {
    if (typeof document === 'undefined') return;
    document.cookie = `access_token=${tokens.access_token}; path=/; max-age=3600`;
    document.cookie = `refresh_token=${tokens.refresh_token}; path=/; max-age=86400`;
}
