import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

export default function PedroProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content style={styles.profile}>
          <Avatar.Text label="PH" size={82} style={styles.avatar} />
          <Text variant="headlineSmall" style={styles.name}>
            Pedro HMA
          </Text>
          <Text style={styles.copy}>
            Responsavel pela implementacao mobile, organizacao das telas, integracao
            com Supabase e preparacao da entrega.
          </Text>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content style={styles.card}>
          <Text variant="titleLarge">Participacao</Text>
          <Text style={styles.copy}>Front-end em React Native + Expo</Text>
          <Text style={styles.copy}>Autenticacao, CRUD e relacionamento no back-end</Text>
          <Text style={styles.copy}>README, roteiro de video e apoio para apresentacao</Text>
        </Card.Content>
      </Card>

      <View>
        <Button icon="arrow-left" mode="outlined" onPress={() => router.back()}>
          Voltar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
    backgroundColor: "#F7F4EF"
  },
  profile: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 28
  },
  avatar: {
    backgroundColor: "#D94141"
  },
  name: {
    color: "#1F2933",
    fontWeight: "800"
  },
  copy: {
    color: "#4B5563",
    lineHeight: 22,
    textAlign: "center"
  },
  card: {
    gap: 8
  }
});
