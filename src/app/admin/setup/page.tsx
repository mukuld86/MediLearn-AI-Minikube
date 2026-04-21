"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Info } from "lucide-react";

export default function AdminSetupPage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                Database Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Legacy cloud setup has been removed. This project now uses MongoDB Atlas
                for authentication and leaderboard persistence.
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Manual setup required</AlertTitle>
                <AlertDescription>
                  Create your Atlas cluster, allow your app IP, create a database user,
                  and set MONGODB_URI in environment variables before running the app.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
