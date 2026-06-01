import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
    getAlertCooldownRemainingSeconds,
    getAlertCooldownSeconds,
} from "@/lib/alert/cooldown";
import { buildAlertActions } from "@/lib/ntfy/actions";

if (!process.env.NTFY_URL) {
    throw new Error("Required environment variables are not set");
}

export async function GET() {
    const session = await getSession();

    if (!session.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
        remainingSeconds: getAlertCooldownRemainingSeconds(session.lastAlertAt),
        cooldownSeconds: getAlertCooldownSeconds(),
    });
}

export async function POST(request: Request) {
    const { message } = await request.json();
    const session = await getSession();

    if (!session.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const now = Date.now();

    const remainingSeconds = getAlertCooldownRemainingSeconds(session.lastAlertAt);
    if (remainingSeconds > 0) {
        return NextResponse.json(
            {
                success: false,
                error: `Please wait ${remainingSeconds} seconds before sending another alert`,
                remainingSeconds,
            },
            { status: 429 }
        );
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

        return NextResponse.json({
            success: true,
            remainingSeconds: getAlertCooldownRemainingSeconds(session.lastAlertAt),
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to send notification: ${error}` }, { status: 500 });
    }
}
