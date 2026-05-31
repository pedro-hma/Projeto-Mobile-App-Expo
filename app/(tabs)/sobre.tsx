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
        CineBox e um app mobile feito em React Native com Expo para organizar uma
        watchlist pessoal de filmes e series.
      </Text>

      <Card>
        <Card.Content>
          <Text variant="titleLarge">Requisitos atendidos</Text>
          <List.Item title="Expo Router" description="Navegacao por arquivos em app/." />
          <List.Item title="Zustand" description="Estado global de autenticacao e catalogo." />
          <List.Item title="Back-end" description="Supabase Auth e tabelas relacionais." />
          <List.Item title="CRUD" description="Criar, listar, editar e excluir itens." />
          <List.Item title="Relacionamento" description="Item da lista vinculado a um genero." />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content style={styles.card}>
          <Text variant="titleLarge">Equipe</Text>
          <Text style={styles.copy}>
            A tela individual da equipe tambem faz parte dos requisitos de navegacao.
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
    gap: 12
  }
});
