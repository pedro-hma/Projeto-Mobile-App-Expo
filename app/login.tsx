import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";

import { useAuthStore } from "@/store/auth-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, signIn } = useAuthStore();

  async function handleLogin() {
    const ok = await signIn(email.trim(), password);
    if (ok) {
      router.replace("/(tabs)/home");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.brand}>
        <Text variant="labelLarge" style={styles.eyebrow}>
          Seu catalogo pessoal
        </Text>
        <Text variant="displaySmall" style={styles.logo}>
          CineBox
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Guarde filmes e series, acompanhe o status de cada item e registre suas notas em poucos toques.
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.form}>
          <Text variant="titleLarge" style={styles.formTitle}>
            Entrar no CineBox
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            label="E-mail"
            mode="outlined"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            label="Senha"
            mode="outlined"
            onChangeText={setPassword}
            secureTextEntry
            value={password}
          />
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <Button
            disabled={!email || !password || loading}
            loading={loading}
            mode="contained"
            onPress={handleLogin}
          >
            Entrar
          </Button>
          <Link href="/signup" asChild>
            <Button mode="text">Criar uma conta</Button>
          </Link>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
    padding: 24,
    backgroundColor: "#F8F6F2"
  },
  brand: {
    gap: 10
  },
  eyebrow: {
    color: "#246BFE",
    fontWeight: "800",
    textTransform: "uppercase"
  },
  logo: {
    color: "#C83349",
    fontWeight: "900"
  },
  subtitle: {
    color: "#52616F",
    lineHeight: 24
  },
  card: {
    borderRadius: 8,
    elevation: 1
  },
  form: {
    gap: 14
  },
  formTitle: {
    color: "#17202A",
    fontWeight: "800"
  }
});
