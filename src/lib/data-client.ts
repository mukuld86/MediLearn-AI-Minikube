import { UserProfile } from "@/lib/auth-types";

async function parseResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            typeof data?.message === "string"
                ? data.message
                : "Request failed. Please try again.";
        throw new Error(message);
    }

    return data as T;
}

export async function getLeaderboard(): Promise<UserProfile[]> {
    const response = await fetch("/api/leaderboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    const data = await parseResponse<{ leaderboard: UserProfile[] }>(response);
    return data.leaderboard || [];
}

export async function updateUserQuizStats(_uid: string, newScore: number) {
    const response = await fetch("/api/quiz/complete", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: newScore }),
    });

    return parseResponse<{
        message: string;
        stats: {
            quizCount: number;
            totalScore: number;
            averageRating: number;
        };
    }>(response);
}

export async function getUserProfile(_uid: string): Promise<UserProfile | null> {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    if (response.status === 401) {
        return null;
    }

    const data = await parseResponse<{ profile: UserProfile }>(response);
    return data.profile || null;
}

export async function saveQuizResult(quizData: {
    score: number;
    category?: string;
    difficulty?: string;
    totalQuestions?: number;
}) {
    const response = await fetch("/api/quiz/complete", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
    });

    return parseResponse<{ message: string }>(response);
}
