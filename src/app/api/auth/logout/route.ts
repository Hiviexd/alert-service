import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    (await cookies()).delete("osu_user");
    return NextResponse.redirect("/");
}
