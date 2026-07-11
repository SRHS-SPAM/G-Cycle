import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyScreen from "@features/mypage/screens/MyScreen";
import SettingsScreen from "@features/mypage/screens/SettingsScreen";

import type { MyStackParamList } from "./types";

const Stack = createNativeStackNavigator<MyStackParamList>();

export function MyStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="My" component={MyScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
