import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

import { useAuthStore } from "@/store/auth-store";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, signUp } = useAuthStore();

  async function handleSignup() {
    const ok = await signUp(name.trim(), email.trim(), password);
    if (ok) {
      router.replace("/(tabs)/home");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Criar conta
        </Text>
        <Text variant="bodyMedium" style={styles.copy}>
          Entre para salvar sua propria lista e demonstrar a autenticacao integrada ao back-end.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput label="Nome" mode="outlined" onChangeText={setName} value={name} />
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
          disabled={!name || !email || password.length < 6 || loading}
          loading={loading}
          mode="contained"
          onPress={handleSignup}
        >
          Cadastrar
        </Button>
        <Button mode="text" onPress={() => router.back()}>
          Voltar ao login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 28,
    padding: 24,
    backgroundColor: "#F7F4EF"
  },
  header: {
    gap: 8
  },
  title: {
    color: "#D94141",
    fontWeight: "800"
  },
  copy: {
    color: "#4B5563",
    lineHeight: 22
  },
  form: {
    gap: 14
  }
});
