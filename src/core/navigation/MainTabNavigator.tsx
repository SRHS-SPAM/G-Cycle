import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "@theme/index";

import { HomeStackNavigator } from "./HomeStackNavigator";
import { MapStackNavigator } from "./MapStackNavigator";
import { MyStackNavigator } from "./MyStackNavigator";
import { RewardStackNavigator } from "./RewardStackNavigator";
import { ScanStackNavigator } from "./ScanStackNavigator";

import type { MainTabParamList } from "./types";
import type { RouteProp } from "@react-navigation/native";

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: "home",
  ScanTab: "qr-code",
  MapTab: "map",
  RewardTab: "gift",
  MyTab: "person",
};

const LABELS: Record<keyof MainTabParamList, string> = {
  HomeTab: "홈",
  ScanTab: "스캔",
  MapTab: "지도",
  RewardTab: "리워드",
  MyTab: "마이",
};

/** Bottom tabs kept to 5, per the info-architecture rule — everything else lives in a stack. */
export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<MainTabParamList> }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabel: LABELS[route.name],
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="ScanTab" component={ScanStackNavigator} />
      <Tab.Screen name="MapTab" component={MapStackNavigator} />
      <Tab.Screen name="RewardTab" component={RewardStackNavigator} />
      <Tab.Screen name="MyTab" component={MyStackNavigator} />
    </Tab.Navigator>
  );
}
