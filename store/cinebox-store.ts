import { create } from "zustand";

import { supabase } from "@/lib/supabase";
import { Genre, WatchItem } from "@/lib/types";

type WatchItemInput = {
  title: string;
  type: "Filme" | "Serie";
  status: WatchItem["status"];
  rating: number | null;
  notes: string | null;
  synopsis: string | null;
  poster_url: string | null;
  external_id: string | null;
  genre_id: string;
};

type CineboxState = {
  genres: Genre[];
  items: WatchItem[];
  loading: boolean;
  error: string | null;
  fetchGenres: () => Promise<void>;
  fetchItems: (userId: string) => Promise<void>;
  createItem: (userId: string, payload: WatchItemInput) => Promise<boolean>;
  updateItem: (id: string, payload: WatchItemInput) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
};

export const useCineboxStore = create<CineboxState>((set, get) => ({
  genres: [],
  items: [],
  loading: false,
  error: null,
  fetchGenres: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.from("genres").select("*").order("name");
    set({ genres: data ?? [], loading: false, error: error?.message ?? null });
  },
  fetchItems: async (userId) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("watch_items")
      .select("*, genres(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    set({ items: data ?? [], loading: false, error: error?.message ?? null });
  },
  createItem: async (userId, payload) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from("watch_items").insert({ ...payload, user_id: userId });
    set({ loading: false, error: error?.message ?? null });
    if (!error) {
      await get().fetchItems(userId);
    }
    return !error;
  },
  updateItem: async (id, payload) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from("watch_items").update(payload).eq("id", id);
    set({ loading: false, error: error?.message ?? null });
    return !error;
  },
  deleteItem: async (id) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from("watch_items").delete().eq("id", id);
    set((state) => ({
      items: error ? state.items : state.items.filter((item) => item.id !== id),
      loading: false,
      error: error?.message ?? null
    }));
    return !error;
  }
}));
