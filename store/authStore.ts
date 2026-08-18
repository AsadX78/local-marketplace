"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile as ProfileType } from "@/lib/types";

interface AuthState {
  user: User | null;
  profile: ProfileType | null;
  loading: boolean;
  setAuth: (user: User | null, profile: ProfileType | null) => void;
  setProfile: (profile: ProfileType | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setAuth: (user, profile) => set({ user, profile, loading: false }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, profile: null, loading: false }),
}));
