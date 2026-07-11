import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CollectionPointDetailScreen from "@features/return/screens/CollectionPointDetailScreen";
import PickupCompleteScreen from "@features/rider/screens/PickupCompleteScreen";
import PickupTaskScreen from "@features/rider/screens/PickupTaskScreen";
import RiderHomeScreen from "@features/rider/screens/RiderHomeScreen";
import RiderMapScreen from "@features/rider/screens/RiderMapScreen";

import type { RiderStackParamList } from "./types";

const Stack = createNativeStackNavigator<RiderStackParamList>();

export function RiderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderHome" component={RiderHomeScreen} />
      <Stack.Screen name="RiderMap" component={RiderMapScreen} />
      <Stack.Screen name="CollectionPointDetail" component={CollectionPointDetailScreen} />
      <Stack.Screen name="PickupTask" component={PickupTaskScreen} />
      <Stack.Screen name="PickupComplete" component={PickupCompleteScreen} />
    </Stack.Navigator>
  );
}
