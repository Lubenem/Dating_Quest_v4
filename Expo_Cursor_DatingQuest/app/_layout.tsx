import { Stack } from "expo-router";
import { ActionsProvider } from "../contexts/ActionsContext";

export default function RootLayout() {
  return (
    <ActionsProvider>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      />
    </ActionsProvider>
  );
}