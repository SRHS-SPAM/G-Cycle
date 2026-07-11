import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "@features/home/screens/HomeScreen";
import StoreDetailScreen from "@features/store/screens/StoreDetailScreen";
import StoreMapScreen from "@features/store/screens/StoreMapScreen";

import type { HomeStackParamList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="StoreMap" component={StoreMapScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
    </Stack.Navigator>
  );
}
