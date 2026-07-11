import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { StatusBadge } from "@components/feedback";
import { colors, spacing, typography } from "@theme/index";

import type { StoreOwnerStackParamList } from "@app/navigation/types";
import type { OrderStatus } from "@types/order";

type Props = NativeStackScreenProps<StoreOwnerStackParamList, "OrderQueue">;

const MOCK_QUEUE: { id: string; label: string; status: OrderStatus }[] = [
  { id: "1", label: "아메리카노 x2", status: "PREPARING" },
  { id: "2", label: "샐러드 x1", status: "READY" },
  { id: "3", label: "라떼 x1", status: "CREATED" },
];

const statusTone: Record<OrderStatus, "success" | "warning" | "info" | "neutral" | "danger"> = {
  CREATED: "neutral",
  PAID: "info",
  PREPARING: "warning",
  READY: "success",
  COMPLETED: "neutral",
  CANCELLED: "danger",
};

export default function OrderQueueScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="주문 현황" />
      <FlatList
        data={MOCK_QUEUE}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <StatusBadge label={item.status} tone={statusTone[item.status]} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body, color: colors.textPrimary },
});
