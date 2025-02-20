import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    (await cookies()).delete("osu_user");
    return NextResponse.redirect(new URL("/", request.url));
}
