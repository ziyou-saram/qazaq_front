import { cookies } from "next/headers";
import CreateContentClient from "./create-content-client";

export default async function CreateContentPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    return <CreateContentClient accessToken={token} />;
}
