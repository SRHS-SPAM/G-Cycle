import type { NavigatorScreenParams } from "@react-navigation/native";

// ---- Feature stacks ----
export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelect: undefined;
  GuestEntry: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  StoreMap: undefined;
  StoreDetail: { storeId: string };
};

export type ScanStackParamList = {
  QRScan: undefined;
  OrderCreate: { storeId: string; containerCode?: string };
  OrderComplete: { orderId: string };
};

export type MapStackParamList = {
  CollectionPointMap: undefined;
  CollectionPointDetail: { collectionPointId: string };
  ReturnGuide: { orderId?: string };
  ReturnComplete: { collectionPointId: string };
};

export type RewardStackParamList = {
  Reward: undefined;
  History: undefined;
};

export type MyStackParamList = {
  My: undefined;
  Settings: undefined;
};

// ---- Main (citizen) tab ----
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ScanTab: NavigatorScreenParams<ScanStackParamList>;
  MapTab: NavigatorScreenParams<MapStackParamList>;
  RewardTab: NavigatorScreenParams<RewardStackParamList>;
  MyTab: NavigatorScreenParams<MyStackParamList>;
};

// ---- Rider ----
export type RiderStackParamList = {
  RiderHome: undefined;
  RiderMap: undefined;
  CollectionPointDetail: { collectionPointId: string };
  PickupTask: { taskId: string };
  PickupComplete: { taskId: string };
};

// ---- Store owner ----
export type StoreOwnerStackParamList = {
  StoreDashboard: undefined;
  OrderQueue: undefined;
  ContainerIssue: undefined;
  ReturnStatus: undefined;
};

// ---- Admin ----
export type AdminStackParamList = {
  AdminDashboard: undefined;
  Analytics: undefined;
  UserManagement: undefined;
  StoreManagement: undefined;
  CollectionPointManagement: undefined;
};

// ---- Root ----
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTab: NavigatorScreenParams<MainTabParamList>;
  RiderStack: NavigatorScreenParams<RiderStackParamList>;
  StoreOwnerStack: NavigatorScreenParams<StoreOwnerStackParamList>;
  AdminStack: NavigatorScreenParams<AdminStackParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
