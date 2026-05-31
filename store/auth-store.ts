import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  bootstrap: async () => {
    if (!hasSupabaseConfig) {
      set({ loading: false, error: "Configure o Supabase no arquivo .env." });
      return;
    }

    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      error: error?.message ?? null
    });
  },
  signIn: async (email, password) => {
    if (!hasSupabaseConfig) {
      set({ error: "Configure o Supabase no arquivo .env." });
      return false;
    }

    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    set({
      session: data.session,
      user: data.user,
      loading: false,
      error: error?.message ?? null
    });
    return !error;
  },
  signUp: async (name, email, password) => {
    if (!hasSupabaseConfig) {
      set({ error: "Configure o Supabase no arquivo .env." });
      return false;
    }

    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    set({
      session: data.session,
      user: data.user,
      loading: false,
      error: error?.message ?? null
    });
    return !error;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, error: null });
  }
}));
