import { randomBytes } from "crypto";
import type { OsuUser } from "@/interfaces/osu";

const OSU_CLIENT_ID = process.env.OSU_CLIENT_ID;
const OSU_CLIENT_SECRET = process.env.OSU_CLIENT_SECRET;
const OSU_CALLBACK_URL = process.env.OSU_CALLBACK_URL;

if (!OSU_CLIENT_ID || !OSU_CLIENT_SECRET || !OSU_CALLBACK_URL) {
    throw new Error("Missing required environment variables for osu! OAuth");
}

export function createOAuthState(): string {
    return randomBytes(32).toString("hex");
}

export async function exchangeCodeForUser(code: string): Promise<OsuUser> {
    const tokenRes = await fetch("https://osu.ppy.sh/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: OSU_CLIENT_ID,
            client_secret: OSU_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: OSU_CALLBACK_URL,
        }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
        throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
        throw new Error("Token exchange did not return an access_token");
    }

    const userRes = await fetch("https://osu.ppy.sh/api/v2/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const userData = await userRes.json();

    if (!userRes.ok) {
        throw new Error(`User fetch failed: ${JSON.stringify(userData)}`);
    }

    if (
        typeof userData.id !== "number" ||
        typeof userData.username !== "string" ||
        typeof userData.avatar_url !== "string"
    ) {
        throw new Error("User response missing required fields");
    }

    return {
        id: userData.id,
        username: userData.username,
        avatar_url: userData.avatar_url,
    };
}
