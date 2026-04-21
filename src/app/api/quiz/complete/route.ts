import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/session";
import { saveQuizResult, updateUserQuizStats } from "@/lib/users";

export async function POST(request: Request) {
    try {
        const session = await getSessionFromCookie();
        if (!session) {
            return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
        }

        const body = await request.json();
        const score = Number(body?.score);
        const category = body?.category ? String(body.category) : undefined;
        const difficulty = body?.difficulty ? String(body.difficulty) : undefined;
        const totalQuestions = Number(body?.totalQuestions || 0) || undefined;

        if (Number.isNaN(score)) {
            return NextResponse.json({ message: "Valid score is required." }, { status: 400 });
        }

        const stats = await updateUserQuizStats(session.uid, score);
        await saveQuizResult({
            uid: session.uid,
            score,
            category,
            difficulty,
            totalQuestions,
            metadata: {
                source: "web-app",
            },
        });

        return NextResponse.json({ message: "Quiz score saved.", stats });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
