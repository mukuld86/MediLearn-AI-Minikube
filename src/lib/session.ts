import "server-only";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "medilearn_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
    uid: string;
    email: string;
};

function getJwtSecret() {
    const secret = process.env.AUTH_JWT_SECRET;

    if (!secret) {
        throw new Error("Missing AUTH_JWT_SECRET environment variable");
    }

    return secret;
}

export function createSessionToken(payload: SessionPayload) {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySessionToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as SessionPayload;
        if (!decoded?.uid || !decoded?.email) {
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}
