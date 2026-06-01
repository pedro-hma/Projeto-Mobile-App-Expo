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
  const watching = items.filter((item) => item.status === "Assistindo").length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text variant="labelLarge" style={styles.eyebrow}>
          Visao geral
        </Text>
        <Text variant="headlineLarge" style={styles.title}>
          CineBox
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Acompanhe sua lista, veja generos disponiveis e acesse rapidamente o CRUD principal do projeto.
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
          <Card.Content style={styles.statContent}>
            <Text variant="headlineMedium" style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Itens salvos</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text variant="headlineMedium" style={styles.statNumber}>{watching}</Text>
            <Text style={styles.statLabel}>Assistindo</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text variant="headlineMedium" style={styles.statNumber}>{completed}</Text>
            <Text style={styles.statLabel}>Concluidos</Text>
          </Card.Content>
        </Card>
      </View>

      <Card>
        <Card.Content style={styles.section}>
          <Text variant="titleLarge" style={styles.cardTitle}>Generos do catalogo</Text>
          <View style={styles.chips}>
            {genres.slice(0, 6).map((genre) => (
              <Chip key={genre.id}>{genre.name}</Chip>
            ))}
          </View>
          {genres.length === 0 ? (
            <Text style={styles.copy}>Nenhum genero carregado. Confira o script SQL no Supabase.</Text>
          ) : null}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content style={styles.section}>
          <Text variant="titleLarge" style={styles.cardTitle}>Destaques da entrega</Text>
          <Text style={styles.copy}>
            O fluxo principal demonstra autenticacao, navegacao por abas, estado global,
            CRUD completo no back-end e relacionamento entre item e genero.
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
    backgroundColor: "#F8F6F2"
  },
  hero: {
    gap: 14,
    paddingTop: 18,
    paddingBottom: 4
  },
  eyebrow: {
    color: "#246BFE",
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: "#C83349",
    fontWeight: "900"
  },
  subtitle: {
    color: "#52616F",
    lineHeight: 25
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  stats: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    flex: 1,
    borderRadius: 8
  },
  statContent: {
    gap: 2,
    minHeight: 76,
    justifyContent: "center"
  },
  statNumber: {
    color: "#17202A",
    fontWeight: "900"
  },
  statLabel: {
    color: "#52616F",
    fontSize: 12
  },
  section: {
    gap: 12
  },
  cardTitle: {
    color: "#17202A",
    fontWeight: "800"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  copy: {
    color: "#52616F",
    lineHeight: 22
  }
});
