import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

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
        <Text variant="displaySmall" style={styles.logo}>
          CineBox
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sua lista pessoal de filmes e series, organizada por genero e status.
        </Text>
      </View>

      <View style={styles.form}>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
    padding: 24,
    backgroundColor: "#F7F4EF"
  },
  brand: {
    gap: 10
  },
  logo: {
    color: "#D94141",
    fontWeight: "800"
  },
  subtitle: {
    color: "#4B5563",
    lineHeight: 24
  },
  form: {
    gap: 14
  }
});
