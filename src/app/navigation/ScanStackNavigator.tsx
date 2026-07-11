import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrderCompleteScreen from "@features/order/screens/OrderCompleteScreen";
import OrderCreateScreen from "@features/order/screens/OrderCreateScreen";
import QRScanScreen from "@features/order/screens/QRScanScreen";

import type { ScanStackParamList } from "./types";

const Stack = createNativeStackNavigator<ScanStackParamList>();

export function ScanStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QRScan" component={QRScanScreen} />
      <Stack.Screen name="OrderCreate" component={OrderCreateScreen} />
      <Stack.Screen name="OrderComplete" component={OrderCompleteScreen} />
    </Stack.Navigator>
  );
}
