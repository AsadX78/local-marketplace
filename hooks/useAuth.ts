"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const { user, profile, loading, setAuth, setProfile, setLoading, logout } =
    useAuthStore();
  const router = useRouter();

  // Initialize auth state
  React.useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (mounted) setAuth(user, (profileData as Profile) || null);
      } else {
        if (mounted) setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setAuth(session.user, (profileData as Profile) || null);
      } else {
        setAuth(null, null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setAuth, setLoading]);

  const signIn = React.useCallback(
    async (email: string, password: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    []
  );

  const signUp = React.useCallback(
    async (email: string, password: string, fullName: string, phone?: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    },
    []
  );

  const signInWithGoogle = React.useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/");
  }, [logout, router]);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!profile?.is_admin,
    isSeller: !!profile?.is_seller,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    setProfile,
  };
}
