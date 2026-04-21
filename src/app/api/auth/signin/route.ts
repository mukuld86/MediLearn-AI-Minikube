import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { findUserByEmail, getUserProfile } from "@/lib/users";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = String(body?.email || "").trim().toLowerCase();
        const password = String(body?.password || "");

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        const token = createSessionToken({ uid: user._id.toString(), email });
        await setSessionCookie(token);

        const profile = await getUserProfile(user._id.toString());

        return NextResponse.json({
            message: "Signed in successfully.",
            user: {
                uid: user._id.toString(),
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            profile,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
