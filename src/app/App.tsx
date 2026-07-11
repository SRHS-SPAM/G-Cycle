import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { RootNavigator } from "@app/navigation";
import { AppProviders } from "@app/providers";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
