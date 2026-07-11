import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HistoryScreen from "@features/reward/screens/HistoryScreen";
import RewardScreen from "@features/reward/screens/RewardScreen";

import type { RewardStackParamList } from "./types";

const Stack = createNativeStackNavigator<RewardStackParamList>();

export function RewardStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reward" component={RewardScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
