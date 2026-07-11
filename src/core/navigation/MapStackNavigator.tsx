import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CollectionPointDetailScreen from "@features/return/screens/CollectionPointDetailScreen";
import CollectionPointMapScreen from "@features/return/screens/CollectionPointMapScreen";
import ReturnCompleteScreen from "@features/return/screens/ReturnCompleteScreen";
import ReturnGuideScreen from "@features/return/screens/ReturnGuideScreen";

import type { MapStackParamList } from "./types";

const Stack = createNativeStackNavigator<MapStackParamList>();

export function MapStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CollectionPointMap" component={CollectionPointMapScreen} />
      <Stack.Screen name="CollectionPointDetail" component={CollectionPointDetailScreen} />
      <Stack.Screen name="ReturnGuide" component={ReturnGuideScreen} />
      <Stack.Screen name="ReturnComplete" component={ReturnCompleteScreen} />
    </Stack.Navigator>
  );
}
