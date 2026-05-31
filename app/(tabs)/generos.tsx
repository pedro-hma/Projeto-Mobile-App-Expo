import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

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
        Esta tela exibe uma segunda entidade do back-end. Cada item da lista pode ser
        associado a um destes generos.
      </Text>

      {loading ? <Text>Carregando...</Text> : null}
      {genres.map((genre) => (
        <Card key={genre.id}>
          <Card.Content style={styles.card}>
            <Text variant="titleMedium">{genre.name}</Text>
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
  card: {
    gap: 8
  }
});
