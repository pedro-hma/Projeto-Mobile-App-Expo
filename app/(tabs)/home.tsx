import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";

import { useAuthStore } from "@/store/auth-store";
import { useCineboxStore } from "@/store/cinebox-store";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { fetchGenres, fetchItems, genres, items } = useCineboxStore();

  useEffect(() => {
    fetchGenres();
    if (user?.id) {
      fetchItems(user.id);
    }
  }, [fetchGenres, fetchItems, user?.id]);

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  const completed = items.filter((item) => item.status === "Concluido").length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text variant="headlineLarge" style={styles.title}>
          CineBox
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Organize filmes e series por genero, status, nota e comentarios pessoais.
        </Text>
        <View style={styles.actions}>
          <Button icon="plus" mode="contained" onPress={() => router.push("/(tabs)/lista")}>
            Novo item
          </Button>
          <Button icon="logout" mode="outlined" onPress={handleLogout}>
            Sair
          </Button>
        </View>
      </View>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium">{items.length}</Text>
            <Text>Total na lista</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineMedium">{completed}</Text>
            <Text>Concluidos</Text>
          </Card.Content>
        </Card>
      </View>

      <Card>
        <Card.Content style={styles.section}>
          <Text variant="titleLarge">Generos cadastrados</Text>
          <View style={styles.chips}>
            {genres.slice(0, 6).map((genre) => (
              <Chip key={genre.id}>{genre.name}</Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content style={styles.section}>
          <Text variant="titleLarge">Entrega do projeto</Text>
          <Text style={styles.copy}>
            O app usa Expo Router, Zustand, Supabase Auth, CRUD de itens da lista,
            exibicao de generos e relacionamento entre item e genero.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 20,
    backgroundColor: "#F7F4EF"
  },
  hero: {
    gap: 14,
    paddingTop: 18
  },
  title: {
    color: "#D94141",
    fontWeight: "900"
  },
  subtitle: {
    color: "#4B5563",
    lineHeight: 25
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  stats: {
    flexDirection: "row",
    gap: 12
  },
  statCard: {
    flex: 1
  },
  section: {
    gap: 12
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  copy: {
    color: "#4B5563",
    lineHeight: 22
  }
});
