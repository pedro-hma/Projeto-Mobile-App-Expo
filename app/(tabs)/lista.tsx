import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  HelperText,
  RadioButton,
  SegmentedButtons,
  Text,
  TextInput
} from "react-native-paper";

import { WatchItem } from "@/lib/types";
import { hasTmdbConfig, MediaSearchResult, searchMedia } from "@/lib/tmdb";
import { useAuthStore } from "@/store/auth-store";
import { useCineboxStore } from "@/store/cinebox-store";

type WatchItemForm = {
  title: string;
  type: "Filme" | "Serie";
  status: WatchItem["status"];
  rating: string;
  notes: string;
  synopsis: string;
  poster_url: string;
  external_id: string;
  genre_id: string;
};

const emptyForm: WatchItemForm = {
  title: "",
  type: "Filme" as const,
  status: "Quero assistir" as WatchItem["status"],
  rating: "",
  notes: "",
  synopsis: "",
  poster_url: "",
  external_id: "",
  genre_id: ""
};

function getRatingMeta(rating: number | null) {
  if (rating === null || Number.isNaN(rating)) {
    return {
      label: "Sem nota",
      backgroundColor: "#ECE7DF",
      textColor: "#52616F",
      icon: "star-outline"
    };
  }

  if (rating >= 8) {
    return {
      label: `${rating}/10 - Excelente`,
      backgroundColor: "#DDF7EC",
      textColor: "#067647",
      icon: "star"
    };
  }

  if (rating >= 5) {
    return {
      label: `${rating}/10 - Boa`,
      backgroundColor: "#FFF4CC",
      textColor: "#8A5A00",
      icon: "star-half-full"
    };
  }

  return {
    label: `${rating}/10 - Baixa`,
    backgroundColor: "#FDE2E1",
    textColor: "#B42318",
    icon: "star-outline"
  };
}

export default function WatchListScreen() {
  const user = useAuthStore((state) => state.user);
  const {
    createItem,
    deleteItem,
    error,
    fetchGenres,
    fetchItems,
    genres,
    items,
    loading,
    updateItem
  } = useCineboxStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);

  useEffect(() => {
    fetchGenres();
    if (user?.id) {
      fetchItems(user.id);
    }
  }, [fetchGenres, fetchItems, user?.id]);

  useEffect(() => {
    if (!form.genre_id && genres[0]?.id) {
      setForm((current) => ({ ...current, genre_id: genres[0].id }));
    }
  }, [form.genre_id, genres]);

  const parsedRating = form.rating ? Number(form.rating.replace(",", ".")) : null;
  const ratingIsValid =
    parsedRating === null || (!Number.isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 10);
  const ratingMeta = getRatingMeta(parsedRating);
  const canSave = useMemo(
    () => Boolean(form.title.trim() && form.genre_id && ratingIsValid),
    [form.genre_id, form.title, ratingIsValid]
  );

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, genre_id: genres[0]?.id ?? "" });
  }

  function startEdit(item: WatchItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      status: item.status,
      rating: item.rating ? String(item.rating) : "",
      notes: item.notes ?? "",
      synopsis: item.synopsis ?? "",
      poster_url: item.poster_url ?? "",
      external_id: item.external_id ?? "",
      genre_id: item.genre_id
    });
  }

  async function handleMediaSearch() {
    setSearchError(null);
    setMediaResults([]);

    if (!hasTmdbConfig) {
      setSearchError("Configure EXPO_PUBLIC_TMDB_TOKEN no arquivo .env para usar a busca automatica.");
      return;
    }

    if (!form.title.trim()) {
      setSearchError("Digite um titulo antes de buscar.");
      return;
    }

    setSearching(true);
    try {
      const results = await searchMedia(form.title);
      setMediaResults(results);
      if (results.length === 0) {
        setSearchError("Nenhum filme ou serie encontrado.");
      }
    } catch (searchException) {
      setSearchError(
        searchException instanceof Error
          ? searchException.message
          : "Nao foi possivel buscar filmes e series agora."
      );
    } finally {
      setSearching(false);
    }
  }

  function applyMediaResult(result: MediaSearchResult) {
    setForm((current) => ({
      ...current,
      title: result.title,
      type: result.type,
      synopsis: result.synopsis ?? "",
      notes: result.synopsis ?? current.notes,
      poster_url: result.posterUrl ?? "",
      external_id: result.externalId
    }));
    setMediaResults([]);
    setSearchError(null);
  }

  async function handleSave() {
    if (!user?.id) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      status: form.status,
      rating: parsedRating,
      notes: form.notes.trim() || null,
      synopsis: form.synopsis.trim() || null,
      poster_url: form.poster_url.trim() || null,
      external_id: form.external_id.trim() || null,
      genre_id: form.genre_id
    };

    const ok = editingId
      ? await updateItem(editingId, payload)
      : await createItem(user.id, payload);

    if (ok) {
      await fetchItems(user.id);
      resetForm();
    }
  }

  function confirmDelete(item: WatchItem) {
    Alert.alert("Excluir item", `Deseja excluir "${item.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteItem(item.id) }
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Minha Lista
      </Text>
      <Text style={styles.copy}>
        Cadastre, edite e remova filmes ou series. Cada registro fica salvo no Supabase e ligado a um genero.
      </Text>

      <Card>
        <Card.Content style={styles.form}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {editingId ? "Editar item" : "Novo item"}
          </Text>
          <TextInput
            label="Titulo do filme ou serie"
            mode="outlined"
            onChangeText={(title) => setForm((current) => ({ ...current, title }))}
            value={form.title}
          />
          <View style={styles.actions}>
            <Button
              disabled={searching || !form.title.trim()}
              icon="movie-search"
              loading={searching}
              mode="contained-tonal"
              onPress={handleMediaSearch}
            >
              Buscar dados
            </Button>
          </View>
          <HelperText type="error" visible={Boolean(searchError)}>
            {searchError}
          </HelperText>
          {mediaResults.length > 0 ? (
            <View style={styles.resultsBox}>
              <Text variant="titleMedium" style={styles.cardTitle}>Resultados encontrados</Text>
              {mediaResults.map((result) => (
                <Pressable
                  key={result.externalId}
                  onPress={() => applyMediaResult(result)}
                  style={styles.resultItem}
                >
                  {result.posterUrl ? (
                    <Image source={{ uri: result.posterUrl }} style={styles.resultPoster} />
                  ) : (
                    <View style={styles.resultPosterFallback}>
                      <Text style={styles.posterFallbackText}>Sem cartaz</Text>
                    </View>
                  )}
                  <View style={styles.resultText}>
                    <Text variant="titleSmall" style={styles.itemName}>
                      {result.title} {result.year ? `(${result.year})` : ""}
                    </Text>
                    <Text style={styles.copy} numberOfLines={3}>
                      {result.synopsis ?? "Sem sinopse disponivel."}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
          <SegmentedButtons
            onValueChange={(type) =>
              setForm((current) => ({ ...current, type: type as "Filme" | "Serie" }))
            }
            value={form.type}
            buttons={[
              { value: "Filme", label: "Filme", icon: "movie" },
              { value: "Serie", label: "Serie", icon: "television-classic" }
            ]}
          />
          <SegmentedButtons
            onValueChange={(status) =>
              setForm((current) => ({ ...current, status: status as WatchItem["status"] }))
            }
            value={form.status}
            buttons={[
              { value: "Quero assistir", label: "Quero" },
              { value: "Assistindo", label: "Assistindo" },
              { value: "Concluido", label: "Concluido" }
            ]}
          />
          <TextInput
            keyboardType="numeric"
            label="Nota de 0 a 10"
            mode="outlined"
            onChangeText={(rating) => setForm((current) => ({ ...current, rating }))}
            value={form.rating}
          />
          <View style={styles.ratingPreview}>
            <Chip
              icon={ratingMeta.icon}
              style={[styles.ratingChip, { backgroundColor: ratingMeta.backgroundColor }]}
              textStyle={{ color: ratingMeta.textColor, fontWeight: "800" }}
            >
              {ratingMeta.label}
            </Chip>
          </View>
          <HelperText type="error" visible={!ratingIsValid}>
            Informe uma nota entre 0 e 10.
          </HelperText>
          <TextInput
            label="Comentario pessoal"
            mode="outlined"
            multiline
            onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
            value={form.notes}
          />
          {form.poster_url ? (
            <View style={styles.selectedMedia}>
              <Image source={{ uri: form.poster_url }} style={styles.selectedPoster} />
              <View style={styles.selectedText}>
                <Text variant="titleMedium" style={styles.itemName}>Dados importados</Text>
                <Text style={styles.copy} numberOfLines={4}>
                  {form.synopsis || "Sinopse importada da busca externa."}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.genreBox}>
            <Text variant="titleMedium">Genero</Text>
            <RadioButton.Group
              onValueChange={(genre_id) => setForm((current) => ({ ...current, genre_id }))}
              value={form.genre_id}
            >
              {genres.map((genre) => (
                <RadioButton.Item key={genre.id} label={genre.name} value={genre.id} />
              ))}
            </RadioButton.Group>
          </View>

          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <View style={styles.actions}>
            <Button disabled={!canSave || loading} loading={loading} mode="contained" onPress={handleSave}>
              {editingId ? "Salvar edicao" : "Criar item"}
            </Button>
            {editingId ? (
              <Button mode="text" onPress={resetForm}>
                Cancelar
              </Button>
            ) : null}
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.cardTitle}>Itens cadastrados</Text>
      {!loading && items.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Text variant="titleMedium" style={styles.emptyTitle}>Sua lista ainda esta vazia</Text>
            <Text style={styles.copy}>
              Crie o primeiro item acima para demonstrar o cadastro no back-end. Depois use editar e excluir no video.
            </Text>
          </Card.Content>
        </Card>
      ) : null}
      {items.map((item) => (
        <Card key={item.id}>
          <Card.Content style={styles.item}>
            <View style={styles.mediaCardHeader}>
              {item.poster_url ? (
                <Image source={{ uri: item.poster_url }} style={styles.cardPoster} />
              ) : (
                <View style={styles.cardPosterFallback}>
                  <Text style={styles.posterFallbackText}>Sem cartaz</Text>
                </View>
              )}
              <View style={styles.mediaInfo}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitle}>
                    <Text variant="titleMedium" style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.copy} numberOfLines={3}>
                      {item.synopsis || item.notes || "Sem sinopse ou comentario."}
                    </Text>
                  </View>
                  <Chip>{item.type}</Chip>
                </View>
              </View>
            </View>
            <View style={styles.chips}>
              <Chip icon="shape">{item.genres?.name ?? "Sem genero"}</Chip>
              <Chip icon="progress-check">{item.status}</Chip>
              <Chip
                icon={getRatingMeta(item.rating).icon}
                style={[styles.ratingChip, { backgroundColor: getRatingMeta(item.rating).backgroundColor }]}
                textStyle={{ color: getRatingMeta(item.rating).textColor, fontWeight: "800" }}
              >
                {getRatingMeta(item.rating).label}
              </Chip>
            </View>
            <View style={styles.actions}>
              <Button icon="pencil" mode="outlined" onPress={() => startEdit(item)}>
                Editar
              </Button>
              <Button icon="delete" mode="text" textColor="#B42318" onPress={() => confirmDelete(item)}>
                Excluir
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
    backgroundColor: "#F8F6F2"
  },
  title: {
    color: "#C83349",
    fontWeight: "800",
    paddingTop: 18
  },
  copy: {
    color: "#52616F",
    lineHeight: 22
  },
  form: {
    gap: 14
  },
  cardTitle: {
    color: "#17202A",
    fontWeight: "800"
  },
  genreBox: {
    borderColor: "#D5CDC2",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8
  },
  ratingPreview: {
    alignItems: "flex-start"
  },
  ratingChip: {
    borderRadius: 8
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  item: {
    gap: 12
  },
  itemName: {
    color: "#17202A",
    fontWeight: "800"
  },
  emptyCard: {
    borderRadius: 8
  },
  emptyContent: {
    gap: 6
  },
  emptyTitle: {
    color: "#17202A",
    fontWeight: "800"
  },
  itemHeader: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  itemTitle: {
    flex: 1,
    gap: 4
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  resultsBox: {
    gap: 10,
    borderColor: "#D5CDC2",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10
  },
  resultItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8
  },
  resultPoster: {
    width: 54,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#ECE7DF"
  },
  resultPosterFallback: {
    width: 54,
    height: 80,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECE7DF",
    padding: 6
  },
  posterFallbackText: {
    color: "#52616F",
    fontSize: 10,
    textAlign: "center"
  },
  resultText: {
    flex: 1,
    gap: 4
  },
  selectedMedia: {
    flexDirection: "row",
    gap: 12,
    borderColor: "#D5CDC2",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10
  },
  selectedPoster: {
    width: 72,
    height: 106,
    borderRadius: 6,
    backgroundColor: "#ECE7DF"
  },
  selectedText: {
    flex: 1,
    gap: 4
  },
  mediaCardHeader: {
    flexDirection: "row",
    gap: 12
  },
  cardPoster: {
    width: 76,
    height: 112,
    borderRadius: 7,
    backgroundColor: "#ECE7DF"
  },
  cardPosterFallback: {
    width: 76,
    height: 112,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECE7DF",
    padding: 8
  },
  mediaInfo: {
    flex: 1
  }
});
