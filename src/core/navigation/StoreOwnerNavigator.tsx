import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ContainerIssueScreen from "@features/storeOwner/screens/ContainerIssueScreen";
import OrderQueueScreen from "@features/storeOwner/screens/OrderQueueScreen";
import ReturnStatusScreen from "@features/storeOwner/screens/ReturnStatusScreen";
import StoreDashboardScreen from "@features/storeOwner/screens/StoreDashboardScreen";

import type { StoreOwnerStackParamList } from "./types";

const Stack = createNativeStackNavigator<StoreOwnerStackParamList>();

export function StoreOwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoreDashboard" component={StoreDashboardScreen} />
      <Stack.Screen name="OrderQueue" component={OrderQueueScreen} />
      <Stack.Screen name="ContainerIssue" component={ContainerIssueScreen} />
      <Stack.Screen name="ReturnStatus" component={ReturnStatusScreen} />
    </Stack.Navigator>
  );
}
