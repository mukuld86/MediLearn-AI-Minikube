import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/session";
import { getLeaderboard } from "@/lib/users";

export async function GET() {
    try {
        const session = await getSessionFromCookie();
        if (!session) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const leaderboard = await getLeaderboard(100);
        return NextResponse.json({ leaderboard });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
