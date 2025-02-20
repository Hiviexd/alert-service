import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const userCookie = (await cookies()).get("osu_user");

    if (!userCookie?.value) {
        return NextResponse.json(null);
    }

    return NextResponse.json(JSON.parse(userCookie.value));
}
