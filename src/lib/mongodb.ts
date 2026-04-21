import "server-only";

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "medilearn";

if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 20,
};

declare global {
    // eslint-disable-next-line no-var
    var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

const clientPromise = global.__mongoClientPromise || client.connect();

if (process.env.NODE_ENV !== "production") {
    global.__mongoClientPromise = clientPromise;
}

export async function getDb() {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
}
