import { NextResponse } from "next/server";
import { cookies } from "next/headers";

if (!process.env.NTFY_URL) {
    throw new Error("Required environment variables are not set");
}

export async function POST(request: Request) {
    const { message } = await request.json();

    // Get authenticated user
    const userCookie = (await cookies()).get("osu_user");
    if (!userCookie?.value) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);

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

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to send notification: ${error}` }, { status: 500 });
    }
}
