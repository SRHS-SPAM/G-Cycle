import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminDashboardScreen from "@features/admin/screens/AdminDashboardScreen";
import AnalyticsScreen from "@features/admin/screens/AnalyticsScreen";
import CollectionPointManagementScreen from "@features/admin/screens/CollectionPointManagementScreen";
import StoreManagementScreen from "@features/admin/screens/StoreManagementScreen";
import UserManagementScreen from "@features/admin/screens/UserManagementScreen";

import type { AdminStackParamList } from "./types";

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="StoreManagement" component={StoreManagementScreen} />
      <Stack.Screen
        name="CollectionPointManagement"
        component={CollectionPointManagementScreen}
      />
    </Stack.Navigator>
  );
}
