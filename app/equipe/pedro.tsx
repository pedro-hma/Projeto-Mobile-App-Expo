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
            Pedro
          </Text>
          <Text variant="labelLarge" style={styles.role}>Desenvolvedor mobile</Text>
          <Text style={styles.copy}>
            Responsavel pela implementacao do app, integracao com Supabase, organizacao da navegacao e preparacao da entrega.
          </Text>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content style={styles.card}>
          <Text variant="titleLarge" style={styles.cardTitle}>Participacao no projeto</Text>
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
    backgroundColor: "#F8F6F2"
  },
  profile: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 28
  },
  avatar: {
    backgroundColor: "#C83349"
  },
  name: {
    color: "#17202A",
    fontWeight: "800"
  },
  copy: {
    color: "#52616F",
    lineHeight: 22,
    textAlign: "center"
  },
  card: {
    gap: 8
  },
  role: {
    color: "#246BFE",
    fontWeight: "800",
    textTransform: "uppercase"
  },
  cardTitle: {
    color: "#17202A",
    fontWeight: "800"
  }
});
