import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const OAUTH_STATE_COOKIE = "oauth_state";

const OAUTH_STATE_MAX_AGE = 600;

const oauthStateCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: OAUTH_STATE_MAX_AGE,
    path: "/",
};

export async function setOAuthStateCookie(state: string) {
    (await cookies()).set(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);
}

export async function verifyAndClearOAuthState(incomingState: string): Promise<boolean> {
    const cookieStore = await cookies();
    const stored = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
    cookieStore.delete(OAUTH_STATE_COOKIE);

    if (!stored || !incomingState || stored.length !== incomingState.length) {
        return false;
    }

    return timingSafeEqual(Buffer.from(stored), Buffer.from(incomingState));
}
