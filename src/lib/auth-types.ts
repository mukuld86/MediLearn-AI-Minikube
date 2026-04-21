export interface AuthUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    username: string;
    photoURL: string | null;
    createdAt: string;
    quizCount: number;
    totalScore: number;
    averageRating: number;
}
