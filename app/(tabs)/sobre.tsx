import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Sobre o CineBox
      </Text>
      <Text style={styles.copy}>
        CineBox e um app mobile para organizar uma watchlist pessoal com login, dados no Supabase e navegacao por abas.
      </Text>

      <Card style={styles.panel}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>Requisitos atendidos</Text>
          <List.Item title="Expo Router" description="Rotas organizadas na pasta app/." />
          <List.Item title="Zustand" description="Estado global para autenticacao e catalogo." />
          <List.Item title="Back-end" description="Supabase Auth e tabelas relacionais." />
          <List.Item title="CRUD" description="Criar, listar, editar e excluir itens da lista." />
          <List.Item title="Relacionamento" description="Cada item pertence a um genero." />
        </Card.Content>
      </Card>

      <Card style={styles.panel}>
        <Card.Content style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>Equipe</Text>
          <Text style={styles.copy}>
            Projeto individual desenvolvido por Pedro HMA.
          </Text>
          <View>
            <Button icon="account" mode="contained-tonal" onPress={() => router.push("/equipe/pedro")}>
              Ver perfil do integrante
            </Button>
          </View>
        </Card.Content>
      </Card>
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
  card: {
    gap: 12
  },
  panel: {
    borderRadius: 8
  },
  cardTitle: {
    color: "#17202A",
    fontWeight: "800"
  }
});
