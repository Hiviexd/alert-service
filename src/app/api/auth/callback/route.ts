import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

if (!process.env.OSU_CLIENT_ID || !process.env.OSU_CLIENT_SECRET || !process.env.OSU_CALLBACK_URL) {
    throw new Error("Missing required environment variables for osu! OAuth");
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect("/");
    }

    try {
        // Exchange code for token
        const tokenRes = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.OSU_CLIENT_ID,
                client_secret: process.env.OSU_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: process.env.OSU_CALLBACK_URL,
            }),
        });

        const { access_token } = await tokenRes.json();

        // Get user data
        const userRes = await fetch("https://osu.ppy.sh/api/v2/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userData = await userRes.json();

        // Store user data in cookie
        (await cookies()).set(
            "osu_user",
            JSON.stringify({
                id: userData.id,
                username: userData.username,
                avatar_url: userData.avatar_url,
            }),
            { secure: true, httpOnly: true }
        );

        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
        console.error("OAuth error:", error);
        return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
    }
}
