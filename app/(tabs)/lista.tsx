import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
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
import { useAuthStore } from "@/store/auth-store";
import { useCineboxStore } from "@/store/cinebox-store";

type WatchItemForm = {
  title: string;
  type: "Filme" | "Serie";
  status: WatchItem["status"];
  rating: string;
  notes: string;
  genre_id: string;
};

const emptyForm: WatchItemForm = {
  title: "",
  type: "Filme" as const,
  status: "Quero assistir" as WatchItem["status"],
  rating: "",
  notes: "",
  genre_id: ""
};

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

  const canSave = useMemo(() => Boolean(form.title.trim() && form.genre_id), [form]);

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
      genre_id: item.genre_id
    });
  }

  async function handleSave() {
    if (!user?.id) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      status: form.status,
      rating: form.rating ? Number(form.rating) : null,
      notes: form.notes.trim() || null,
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
        CRUD completo de filmes e series com relacionamento por genero.
      </Text>

      <Card>
        <Card.Content style={styles.form}>
          <Text variant="titleLarge">{editingId ? "Editar item" : "Novo item"}</Text>
          <TextInput
            label="Titulo"
            mode="outlined"
            onChangeText={(title) => setForm((current) => ({ ...current, title }))}
            value={form.title}
          />
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
          <TextInput
            label="Comentario"
            mode="outlined"
            multiline
            onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
            value={form.notes}
          />

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

      <Text variant="titleLarge">Itens cadastrados</Text>
      {items.map((item) => (
        <Card key={item.id}>
          <Card.Content style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitle}>
                <Text variant="titleMedium">{item.title}</Text>
                <Text style={styles.copy}>{item.notes || "Sem comentario"}</Text>
              </View>
              <Chip>{item.type}</Chip>
            </View>
            <View style={styles.chips}>
              <Chip icon="shape">{item.genres?.name ?? "Sem genero"}</Chip>
              <Chip icon="progress-check">{item.status}</Chip>
              {item.rating ? <Chip icon="star">{item.rating}/10</Chip> : null}
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
    backgroundColor: "#F7F4EF"
  },
  title: {
    color: "#D94141",
    fontWeight: "800",
    paddingTop: 18
  },
  copy: {
    color: "#4B5563",
    lineHeight: 22
  },
  form: {
    gap: 14
  },
  genreBox: {
    borderColor: "#D6CEC2",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  item: {
    gap: 12
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
  }
});
