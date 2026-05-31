import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D94141",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="home-variant" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="lista"
        options={{
          title: "Lista",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="movie-open" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="generos"
        options={{
          title: "Generos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="shape" size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: "Sobre",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="information" size={size} />
          )
        }}
      />
    </Tabs>
  );
}
