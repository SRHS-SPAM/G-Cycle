import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorState, LoadingSpinner } from "@components/feedback";
import { useRewardSummary } from "@hooks/queries/useRewards";
import { colors, radius, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

import type { RewardStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<RewardStackParamList, "Reward">;

/** Core conversion screen: shows what members earn that guests miss out on. */
export default function RewardScreen({ navigation }: Props) {
  const { data: summary, isLoading, isError, refetch } = useRewardSummary();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !summary) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>적립 포인트</Text>
        <Text style={styles.points}>{summary.points.toLocaleString("ko-KR")}P</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>환급 가능 금액</Text>
            <Text style={styles.rowValue}>{formatCurrency(summary.refundableAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>누적 반납 횟수</Text>
            <Text style={styles.rowValue}>{summary.totalContainersReturned}회</Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate("History")}>
          <Text style={styles.historyLink}>이용 내역 전체 보기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  label: { ...typography.body, color: colors.textSecondary },
  points: { ...typography.h1, color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },
  historyLink: { ...typography.body, color: colors.primary, textAlign: "center", marginTop: spacing.lg },
});
