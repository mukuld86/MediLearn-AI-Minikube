import "server-only";

import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { generateRandomUsername } from "@/lib/utils";

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

type UserDocument = {
    _id?: ObjectId;
    email: string;
    passwordHash: string;
    displayName: string;
    username: string;
    photoURL: string | null;
    createdAt: Date;
    quizCount: number;
    totalScore: number;
    averageRating: number;
};

function toUserProfile(user: UserDocument): UserProfile {
    if (!user._id) {
        throw new Error("User record is missing _id");
    }

    return {
        uid: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        photoURL: user.photoURL,
        createdAt: user.createdAt.toISOString(),
        quizCount: user.quizCount,
        totalScore: user.totalScore,
        averageRating: user.averageRating,
    };
}

export async function ensureUserIndexes() {
    const db = await getDb();
    await db.collection<UserDocument>("users").createIndexes([
        { key: { email: 1 }, unique: true, name: "users_email_unique" },
        { key: { averageRating: -1 }, name: "users_average_rating_desc" },
    ]);
}

export async function createUser(params: {
    email: string;
    passwordHash: string;
    displayName?: string;
}) {
    const db = await getDb();
    const users = db.collection<UserDocument>("users");

    const email = params.email.trim().toLowerCase();
    const now = new Date();
    const displayName =
        params.displayName?.trim() || email.split("@")[0] || "Learner";

    const document: UserDocument = {
        email,
        passwordHash: params.passwordHash,
        displayName,
        username: generateRandomUsername(),
        photoURL: null,
        createdAt: now,
        quizCount: 0,
        totalScore: 0,
        averageRating: 0,
    };

    const insertResult = await users.insertOne(document);

    const inserted = await users.findOne({ _id: insertResult.insertedId });
    if (!inserted) {
        throw new Error("Could not load newly created user");
    }

    return inserted;
}

export async function findUserByEmail(email: string) {
    const db = await getDb();
    return db
        .collection<UserDocument>("users")
        .findOne({ email: email.trim().toLowerCase() });
}

export async function findUserById(uid: string) {
    if (!ObjectId.isValid(uid)) {
        return null;
    }

    const db = await getDb();
    return db
        .collection<UserDocument>("users")
        .findOne({ _id: new ObjectId(uid) });
}

export async function updateUserQuizStats(uid: string, newScore: number) {
    if (!ObjectId.isValid(uid)) {
        throw new Error("Invalid user id");
    }

    const db = await getDb();
    const users = db.collection<UserDocument>("users");
    const userId = new ObjectId(uid);

    const user = await users.findOne({ _id: userId });
    if (!user) {
        throw new Error("User not found");
    }

    const quizCount = (user.quizCount || 0) + 1;
    const totalScore = (user.totalScore || 0) + newScore;
    const averageRating = totalScore / quizCount;

    await users.updateOne(
        { _id: userId },
        {
            $set: {
                quizCount,
                totalScore,
                averageRating,
            },
        }
    );

    return {
        quizCount,
        totalScore,
        averageRating,
    };
}

export async function saveQuizResult(payload: {
    uid: string;
    score: number;
    category?: string;
    difficulty?: string;
    totalQuestions?: number;
    metadata?: Record<string, unknown>;
}) {
    if (!ObjectId.isValid(payload.uid)) {
        throw new Error("Invalid user id");
    }

    const db = await getDb();
    const quizResults = db.collection("quizResults");

    await quizResults.insertOne({
        userId: new ObjectId(payload.uid),
        score: payload.score,
        category: payload.category || null,
        difficulty: payload.difficulty || null,
        totalQuestions: payload.totalQuestions || null,
        metadata: payload.metadata || null,
        createdAt: new Date(),
    });
}

export async function getLeaderboard(limitCount = 100): Promise<UserProfile[]> {
    const db = await getDb();
    const users = await db
        .collection<UserDocument>("users")
        .find({})
        .sort({ averageRating: -1 })
        .limit(limitCount)
        .toArray();

    return users.map(toUserProfile);
}

export async function getUserProfile(uid: string) {
    const user = await findUserById(uid);
    if (!user) {
        return null;
    }
    return toUserProfile(user);
}
