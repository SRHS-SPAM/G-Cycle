import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing, typography } from "@theme/index";

import type { AdminStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminDashboard">;

const SUMMARY = [
  { label: "오늘 주문", value: "312건" },
  { label: "활성 수거함", value: "48곳" },
  { label: "활동 라이더", value: "21명" },
];

const MENU = [
  { label: "통계", screen: "Analytics" as const },
  { label: "회원 관리", screen: "UserManagement" as const },
  { label: "매장 관리", screen: "StoreManagement" as const },
  { label: "수거함 관리", screen: "CollectionPointManagement" as const },
];

export default function AdminDashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>관리자 대시보드</Text>
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
        {MENU.map((item) => (
          <Pressable key={item.screen} style={styles.menuRow} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        ))}
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
