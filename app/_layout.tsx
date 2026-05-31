import { Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { theme } from "@/theme";

export default function RootLayout() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ session, user: session?.user ?? null });
    });

    return () => data.subscription.unsubscribe();
  }, [bootstrap]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="equipe/pedro" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
