import { NextResponse } from "next/server";
import { clearLegacyAuthCookies, getSession } from "@/lib/auth/session";

export async function POST() {
    const session = await getSession();
    session.destroy();
    await clearLegacyAuthCookies();

    return NextResponse.json({ success: true });
}
