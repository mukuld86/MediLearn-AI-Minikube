# MediLearn AI Database Overview

This document describes the MongoDB Atlas configuration and database design for MediLearn AI.

---

## Database Model

### Collections

* `users`
* `quizResults`

### `users` schema

* `_id` — ObjectId
* `email` — string, unique, normalized to lowercase
* `passwordHash` — string
* `displayName` — string
* `username` — string
* `photoURL` — string | null
* `createdAt` — Date
* `quizCount` — number
* `totalScore` — number
* `averageRating` — number

### `quizResults` schema

* `_id` — ObjectId
* `userId` — ObjectId
* `score` — number
* `category` — string | null
* `difficulty` — string | null
* `totalQuestions` — number | null
* `metadata` — object | null
* `createdAt` — Date

---

## Indexes

The application relies on the following indexes:

* `users.email` — unique
* `users.averageRating` — descending

These indexes are provisioned by the application during user creation.

---

## Environment Variables

The database layer requires the following variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/medilearn?retryWrites=true&w=majority
MONGODB_DB_NAME=medilearn
AUTH_JWT_SECRET=YOUR_LONG_RANDOM_SECRET
```

---

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Add your application IP address to Network Access.
3. Create a database user with `readWrite` permissions.
4. Store the connection string in `MONGODB_URI`.

---

## Application API Endpoints

The database is used by the following API routes:

* `POST /api/auth/signup`
* `POST /api/auth/signin`
* `POST /api/auth/signout`
* `GET /api/auth/me`
* `GET /api/leaderboard`
* `POST /api/quiz/complete`

---

## Notes

This document is intended to provide a concise reference for the MongoDB schema, environment configuration, and Atlas setup required by MediLearn AI.