import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { OsuUser } from "@/interfaces/osu";

export interface SessionData extends OsuUser {
    lastAlertAt?: number;
}

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("SESSION_SECRET must be set and at least 32 characters");
    }
    return secret;
}

function getSessionOptions(): SessionOptions {
    return {
        cookieName: "osu_session",
        password: getSessionSecret(),
        ttl: SEVEN_DAYS_SECONDS,
        cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SEVEN_DAYS_SECONDS - 60,
            path: "/",
        },
    };
}

export async function getSession() {
    return getIronSession<SessionData>(await cookies(), getSessionOptions());
}

export async function clearLegacyAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("osu_user");
    cookieStore.delete("last_alert");
}
