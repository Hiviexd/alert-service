import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
    const session = await getSession();

    if (!session.id) {
        return NextResponse.json(null);
    }

    return NextResponse.json({
        id: session.id,
        username: session.username,
        avatar_url: session.avatar_url,
    });
}
