import { NextResponse } from "next/server";
import { createOAuthState } from "@/lib/auth/oauth";
import { setOAuthStateCookie } from "@/lib/auth/oauth-state";

async function initiateLogin() {
    const state = createOAuthState();
    await setOAuthStateCookie(state);

    const params = new URLSearchParams({
        client_id: process.env.OSU_CLIENT_ID as string,
        redirect_uri: process.env.OSU_CALLBACK_URL as string,
        response_type: "code",
        scope: "identify",
        state,
    });

    const authorizeUrl = `https://osu.ppy.sh/oauth/authorize?${params}`;
    return NextResponse.json({ url: authorizeUrl });
}

export async function POST() {
    return initiateLogin();
}
