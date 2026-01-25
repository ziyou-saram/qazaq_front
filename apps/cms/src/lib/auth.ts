export function getAccessToken() {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return match ? match[2] : undefined;
}
