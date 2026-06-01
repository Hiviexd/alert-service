import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForUser } from "@/lib/auth/oauth";
import { verifyAndClearOAuthState } from "@/lib/auth/oauth-state";
import { clearLegacyAuthCookies, getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    const stateValid = await verifyAndClearOAuthState(state);
    if (!stateValid) {
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }

    try {
        const user = await exchangeCodeForUser(code);
        const session = await getSession();

        session.id = user.id;
        session.username = user.username;
        session.avatar_url = user.avatar_url;
        await session.save();

        await clearLegacyAuthCookies();

        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
        console.error("OAuth error:", error);
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }
}
