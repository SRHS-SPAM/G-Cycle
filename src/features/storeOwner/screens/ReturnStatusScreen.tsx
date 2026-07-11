import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { StatusBadge } from "@components/feedback";
import { colors, spacing, typography } from "@theme/index";

import type { StoreOwnerStackParamList } from "@app/navigation/types";
import type { ContainerStatus } from "@types/container";

type Props = NativeStackScreenProps<StoreOwnerStackParamList, "ReturnStatus">;

const MOCK_CONTAINERS: { id: string; code: string; status: ContainerStatus }[] = [
  { id: "1", code: "GC-0001", status: "IN_USE" },
  { id: "2", code: "GC-0002", status: "RETURNED" },
  { id: "3", code: "GC-0003", status: "COLLECTED" },
];

const statusLabel: Record<ContainerStatus, string> = {
  ISSUED: "발급됨",
  IN_USE: "사용중",
  RETURNED: "반납됨",
  COLLECTED: "수거됨",
  WASHING: "세척중",
};

const statusTone: Record<ContainerStatus, "success" | "warning" | "info" | "neutral"> = {
  ISSUED: "neutral",
  IN_USE: "warning",
  RETURNED: "info",
  COLLECTED: "success",
  WASHING: "neutral",
};

export default function ReturnStatusScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="반납 현황" />
      <FlatList
        data={MOCK_CONTAINERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.code}</Text>
            <StatusBadge label={statusLabel[item.status]} tone={statusTone[item.status]} />
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
