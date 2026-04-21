import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/session";
import { getUserProfile } from "@/lib/users";

export async function GET() {
    try {
        const session = await getSessionFromCookie();
        if (!session) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const profile = await getUserProfile(session.uid);
        if (!profile) {
            return NextResponse.json({ message: "User not found." }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                uid: profile.uid,
                email: profile.email,
                displayName: profile.displayName,
                photoURL: profile.photoURL,
            },
            profile,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
