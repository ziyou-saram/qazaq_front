module.exports = [
"[project]/apps/cms/src/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "getServerApi",
    ()=>getServerApi,
    "resolveMediaUrl",
    ()=>resolveMediaUrl
]);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
class APIClient {
    baseURL;
    accessToken;
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    setAccessToken(token) {
        this.accessToken = token;
    }
    async request(endpoint, options) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            ...options?.headers
        };
        if (!(options?.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        if (this.accessToken) {
            headers["Authorization"] = `Bearer ${this.accessToken}`;
        }
        const response = await fetch(url, {
            ...options,
            headers
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    detail: `HTTP ${response.status}: ${response.statusText}`
                }));
            if (Array.isArray(error.detail)) {
                const message = error.detail.map((item)=>`${item.loc?.join(".") || "field"}: ${item.msg}`).join("; ");
                throw new Error(message);
            }
            throw new Error(error.detail);
        }
        return response.json();
    }
    auth = {
        login: (credentials)=>this.request("/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials)
            }),
        register: (data)=>this.request("/auth/register", {
                method: "POST",
                body: JSON.stringify(data)
            }),
        me: (token)=>{
            const headers = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return this.request("/auth/me", {
                headers
            });
        }
    };
    media = {
        upload: (file)=>{
            const formData = new FormData();
            formData.append("file", file);
            return this.request("/media/upload", {
                method: "POST",
                body: formData
            });
        }
    };
}
const api = new APIClient(API_URL);
function resolveMediaUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseUrl}${path}`;
}
async function getServerApi() {
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const serverApi = new APIClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
    if (token) {
        serverApi.setAccessToken(token);
    }
    return serverApi;
}
}),
"[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"006be408f301c3b0a72fcb75c3d6af7213e8a6f67b":"logout","60b13457ed6f7bb6eaaab8a58962fbe0a3181f6479":"login"},"",""] */ __turbopack_context__.s([
    "login",
    ()=>login,
    "logout",
    ()=>logout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/cms/src/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function login(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"].auth.login({
            email,
            password
        });
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set('access_token', response.access_token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        cookieStore.set('refresh_token', response.refresh_token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
        });
    } catch (error) {
        return {
            error: 'Неверный email или пароль'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/cms/dashboard');
}
async function logout() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    logout
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "60b13457ed6f7bb6eaaab8a58962fbe0a3181f6479", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "006be408f301c3b0a72fcb75c3d6af7213e8a6f67b", null);
}),
"[project]/apps/cms/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/cms/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60b13457ed6f7bb6eaaab8a58962fbe0a3181f6479",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$cms$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/cms/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$cms$2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/cms/src/actions/auth.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=apps_cms_46f0f944._.js.map