import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { buildAlertActions } from "@/lib/ntfy/actions";

if (!process.env.NTFY_URL) {
    throw new Error("Required environment variables are not set");
}

const COOLDOWN_MS = process.env.ALERT_COOLDOWN_SECONDS
    ? parseInt(process.env.ALERT_COOLDOWN_SECONDS) * 1000
    : 60000;

export async function POST(request: Request) {
    const { message } = await request.json();
    const session = await getSession();

    if (!session.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const now = Date.now();

    if (session.lastAlertAt) {
        const timeSinceLastAlert = now - session.lastAlertAt;
        if (timeSinceLastAlert < COOLDOWN_MS) {
            const remainingTime = Math.ceil((COOLDOWN_MS - timeSinceLastAlert) / 1000);
            return NextResponse.json(
                {
                    success: false,
                    error: `Please wait ${remainingTime} seconds before sending another alert`,
                },
                { status: 429 }
            );
        }
    }

    try {
        const osuProfileUrl = `https://osu.ppy.sh/users/${session.id}`;
        const actions = buildAlertActions(message, [
            { label: "osu! profile", url: osuProfileUrl },
        ]);

        await fetch(`${process.env.NTFY_URL}`, {
            method: "POST",
            body: message,
            headers: {
                Title: `ALERT from: ${session.username}`,
                Priority: "max",
                Tags: "rotating_light,rotating_light",
                Actions: actions,
            },
        });

        session.lastAlertAt = now;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to send notification: ${error}` }, { status: 500 });
    }
}
