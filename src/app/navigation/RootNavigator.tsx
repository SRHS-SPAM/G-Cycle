import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import SplashScreen from "@features/auth/screens/SplashScreen";
import { useAuthStore } from "@store/authStore";

import { AdminNavigator } from "./AdminNavigator";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabNavigator } from "./MainTabNavigator";
import { RiderNavigator } from "./RiderNavigator";
import { StoreOwnerNavigator } from "./StoreOwnerNavigator";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Picks the whole navigation subtree by role. Guests and members both land in
 * MainTab (guest just has a restricted Reward/My experience inside), while
 * rider / store owner / admin get entirely separate root stacks per the spec.
 */
export function RootNavigator() {
  const { hydrated, hydrate, isAuthenticated, isGuest, role } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return <SplashScreen />;
  }

  const showAuth = !isAuthenticated && !isGuest;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showAuth ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : role === "RIDER" ? (
          <Stack.Screen name="RiderStack" component={RiderNavigator} />
        ) : role === "STORE_OWNER" ? (
          <Stack.Screen name="StoreOwnerStack" component={StoreOwnerNavigator} />
        ) : role === "ADMIN" ? (
          <Stack.Screen name="AdminStack" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="MainTab" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
