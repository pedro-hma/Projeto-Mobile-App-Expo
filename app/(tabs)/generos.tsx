import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

import { useCineboxStore } from "@/store/cinebox-store";

export default function GenresScreen() {
  const { fetchGenres, genres, loading } = useCineboxStore();

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Generos
      </Text>
      <Text style={styles.copy}>
        Esta tela exibe a segunda entidade do back-end. Cada filme ou serie criado na lista aponta para um destes generos.
      </Text>

      {loading ? <Text>Carregando...</Text> : null}
      {genres.map((genre) => (
        <Card key={genre.id} style={styles.genreCard}>
          <Card.Content style={styles.card}>
            <View style={styles.genreHeader}>
              <Text variant="titleMedium" style={styles.genreName}>{genre.name}</Text>
              <Chip compact>Supabase</Chip>
            </View>
            <Text style={styles.copy}>{genre.description}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
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
  card: {
    gap: 8
  },
  genreCard: {
    borderRadius: 8
  },
  genreHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  genreName: {
    color: "#17202A",
    fontWeight: "800"
  }
});
