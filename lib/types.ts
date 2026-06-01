export type Genre = {
  id: string;
  name: string;
  description: string | null;
};

export type WatchStatus = "Quero assistir" | "Assistindo" | "Concluido";

export type WatchItem = {
  id: string;
  title: string;
  type: "Filme" | "Serie";
  status: WatchStatus;
  rating: number | null;
  notes: string | null;
  synopsis: string | null;
  poster_url: string | null;
  external_id: string | null;
  genre_id: string;
  user_id: string;
  created_at: string;
  genres?: Genre | null;
};
