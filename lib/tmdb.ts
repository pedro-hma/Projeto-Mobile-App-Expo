export type MediaSearchResult = {
  externalId: string;
  title: string;
  type: "Filme" | "Serie";
  year: string | null;
  synopsis: string | null;
  posterUrl: string | null;
};

type TmdbResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  poster_path?: string | null;
};

const TMDB_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

export const hasTmdbConfig = Boolean(TMDB_TOKEN);

export async function searchMedia(query: string): Promise<MediaSearchResult[]> {
  if (!TMDB_TOKEN || !query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    query: query.trim(),
    include_adult: "false",
    language: "pt-BR",
    page: "1"
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/multi?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel buscar filmes e series agora.");
  }

  const data = (await response.json()) as { results?: TmdbResult[] };

  return (data.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 5)
    .map((item) => {
      const date = item.release_date ?? item.first_air_date ?? "";
      const title = item.title ?? item.name ?? "Sem titulo";

      return {
        externalId: `${item.media_type}:${item.id}`,
        title,
        type: item.media_type === "movie" ? "Filme" : "Serie",
        year: date ? date.slice(0, 4) : null,
        synopsis: item.overview || null,
        posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null
      };
    });
}
