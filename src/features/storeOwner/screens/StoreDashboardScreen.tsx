import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing, typography } from "@theme/index";

import type { StoreOwnerStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<StoreOwnerStackParamList, "StoreDashboard">;

const SUMMARY = [
  { label: "오늘 주문", value: "42건" },
  { label: "대기 중", value: "5건" },
  { label: "발급 용기", value: "128개" },
];

export default function StoreDashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>매장 현황</Text>
      </View>
      <View style={styles.summaryRow}>
        {SUMMARY.map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.menuGroup}>
        <Pressable style={styles.menuRow} onPress={() => navigation.navigate("OrderQueue")}>
          <Text style={styles.menuLabel}>주문 현황 보기</Text>
        </Pressable>
        <Pressable style={styles.menuRow} onPress={() => navigation.navigate("ContainerIssue")}>
          <Text style={styles.menuLabel}>다회용기 발급/회수</Text>
        </Pressable>
        <Pressable style={styles.menuRow} onPress={() => navigation.navigate("ReturnStatus")}>
          <Text style={styles.menuLabel}>반납 현황</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl },
  title: { ...typography.h1, color: colors.textPrimary },
  summaryRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.xl },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  summaryValue: { ...typography.h3, color: colors.textPrimary },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  menuGroup: { marginTop: spacing.xl },
  menuRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { ...typography.body, color: colors.textPrimary },
});
