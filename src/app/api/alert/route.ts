import { NextResponse } from "next/server";
import { cookies } from "next/headers";

if (!process.env.NTFY_URL) {
    throw new Error("Required environment variables are not set");
}

const COOLDOWN_MS = 
    process.env.ALERT_COOLDOWN_SECONDS
        ? parseInt(process.env.ALERT_COOLDOWN_SECONDS) * 1000 
        : 60000;

export async function POST(request: Request) {
    const { message } = await request.json();

    // Get authenticated user
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("osu_user");
    if (!userCookie?.value) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);

    const lastAlert = cookieStore.get("last_alert");
    const now = Date.now();

    if (lastAlert) {
        const timeSinceLastAlert = now - parseInt(lastAlert.value);
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
        await fetch(`${process.env.NTFY_URL}`, {
            method: "POST",
            body: message,
            headers: {
                Title: `ALERT from: ${user.username}`,
                Priority: "max",
                Tags: "rotating_light,rotating_light",
                Actions: `view, osu! profile, https://osu.ppy.sh/users/${user.id}`,
            },
        });

        // Set the last alert timestamp
        cookieStore.set("last_alert", now.toString(), {
            httpOnly: true,
            secure: true,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to send notification: ${error}` }, { status: 500 });
    }
}
