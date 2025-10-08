import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ActionsProvider } from "../contexts/ActionsContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ActionsProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
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
    </GestureHandlerRootView>
  );
}