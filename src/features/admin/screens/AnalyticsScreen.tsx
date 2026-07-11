import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { colors, radius, spacing, typography } from "@theme/index";

import type { AdminStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "Analytics">;

const METRICS = [
  { label: "누적 반납 횟수", value: "128,402회" },
  { label: "플라스틱 절감 추정치", value: "3.1톤" },
  { label: "평균 수거 소요 시간", value: "42분" },
];

export default function AnalyticsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="통계" />
      <View style={styles.content}>
        {METRICS.map((m) => (
          <View key={m.label} style={styles.card}>
            <Text style={styles.value}>{m.value}</Text>
            <Text style={styles.label}>{m.label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, gap: 4 },
  value: { ...typography.h2, color: colors.textPrimary },
  label: { ...typography.caption, color: colors.textSecondary },
});
