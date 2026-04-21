"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

type AuthMode = "signin" | "signup";

export function SigninForm() {
  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();
  const { refreshUserProfile } = useAuth();
  const router = useRouter();

  const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
  const submitLabel = mode === "signin" ? "Sign In" : "Create Account";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const payload: Record<string, string> = {
        email: email.trim(),
        password,
      };

      if (mode === "signup") {
        payload.displayName = displayName.trim();
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Authentication failed");
      }

      await refreshUserProfile();

      toast({
        title: mode === "signin" ? "Signed in" : "Account created",
        description:
          mode === "signin"
            ? "Welcome back to MediLearn AI."
            : "Your account is ready. Welcome to MediLearn AI.",
      });

      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/quiz";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";

      toast({
        title: mode === "signin" ? "Sign-in failed" : "Sign-up failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={mode === "signin" ? "default" : "outline"}
          onClick={() => setMode("signin")}
        >
          Sign In
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "outline"}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Dr. Jane Doe"
              autoComplete="name"
              required={mode === "signup"}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </div>
  );
}
