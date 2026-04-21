"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthUser, UserProfile } from "@/lib/auth-types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refreshUserProfile: () => Promise<void>;
  userProfile: UserProfile | null;
  signOutUser: () => Promise<void>;
  profileLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUserProfile: async () => {},
  userProfile: null,
  signOutUser: async () => {},
  profileLoading: false,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshUserProfile = async () => {
    setProfileLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setUser(null);
        setUserProfile(null);
        setError(null);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to load user session");
      }

      const data = await response.json();
      setUser(data.user as AuthUser);
      setUserProfile(data.profile as UserProfile);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load user session";

      setError(errorMessage);
      toast({
        title: "Session Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Sign out failed");
      }

      setUser(null);
      setUserProfile(null);
      setError(null);
      toast({
        title: "Signed out",
        description: "You have successfully signed out.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Sign out failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    user,
    loading,
    error,
    refreshUserProfile,
    userProfile,
    signOutUser,
    profileLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
