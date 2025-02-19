import { NextResponse } from "next/server";
import helpers from "@/helpers";

if (!process.env.NTFY_URL || !process.env.OSU_API_KEY) {
    throw new Error("Required environment variables are not set");
}

export async function POST(request: Request) {
    const { username, message, verifyUser } = await request.json();
    let user;

    try {
        if (verifyUser) {
            const verifiedUser = await helpers.verifyOsuUsername(username);
            if (!verifiedUser) {
                return NextResponse.json({ success: false, error: "Invalid osu! username" }, { status: 400 });
            }
            user = verifiedUser;
        } else {
            user = {
                username: username,
                user_id: "@" + username,
            };
        }

        await fetch(`${process.env.NTFY_URL}`, {
            method: "POST",
            body: message,
            headers: {
                Title: `ALERT from: ${user.username}`,
                Priority: "max",
                Tags: "rotating_light,rotating_light",
                Actions: `view, osu! profile, https://osu.ppy.sh/users/${user.user_id}`,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to send notification: ${error}` }, { status: 500 });
    }
}
