import { NextResponse } from "next/server";

if (!process.env.OSU_CLIENT_ID || !process.env.OSU_CALLBACK_URL) {
    throw new Error("Missing required environment variables for osu! OAuth");
}

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.OSU_CLIENT_ID as string,
        redirect_uri: process.env.OSU_CALLBACK_URL as string,
        response_type: "code",
        scope: "identify",
    });

    return NextResponse.redirect(`https://osu.ppy.sh/oauth/authorize?${params}`);
}
