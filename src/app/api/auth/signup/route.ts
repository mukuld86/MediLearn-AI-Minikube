import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import {
    createUser,
    ensureUserIndexes,
    findUserByEmail,
    getUserProfile,
} from "@/lib/users";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = String(body?.email || "").trim().toLowerCase();
        const password = String(body?.password || "");
        const displayName = body?.displayName
            ? String(body.displayName).trim()
            : undefined;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        await ensureUserIndexes();

        const existing = await findUserByEmail(email);
        if (existing) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        const created = await createUser({ email, passwordHash, displayName });
        const token = createSessionToken({ uid: created._id.toString(), email });
        await setSessionCookie(token);

        const profile = await getUserProfile(created._id.toString());

        return NextResponse.json({
            message: "Account created successfully.",
            user: {
                uid: created._id.toString(),
                email: created.email,
                displayName: created.displayName,
                photoURL: created.photoURL,
            },
            profile,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
