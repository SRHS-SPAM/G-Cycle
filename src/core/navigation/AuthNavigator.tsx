import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GuestEntryScreen from "@features/auth/screens/GuestEntryScreen";
import LoginScreen from "@features/auth/screens/LoginScreen";
import OnboardingScreen from "@features/auth/screens/OnboardingScreen";
import RoleSelectScreen from "@features/auth/screens/RoleSelectScreen";
import SignUpScreen from "@features/auth/screens/SignUpScreen";

import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="GuestEntry" component={GuestEntryScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
