import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { EmptyState, ErrorState, LoadingSpinner } from "@components/feedback";
import { useRewardHistory } from "@hooks/queries/useRewards";
import { colors, spacing, typography } from "@theme/index";
import { formatCurrency, formatDateTime } from "@utils/format";

import type { RewardStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<RewardStackParamList, "History">;

export default function HistoryScreen({ navigation }: Props) {
  const { data: history, isLoading, isError, refetch } = useRewardHistory();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="이용 내역" />
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !history?.length ? (
        <EmptyState title="아직 내역이 없어요" description="첫 반납을 완료하면 여기에 표시돼요." />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
              </View>
              <Text style={styles.amount}>
                {item.type === "REDEEMED" ? "-" : "+"}
                {formatCurrency(Math.abs(item.amount))}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  description: { ...typography.bodyBold, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary },
  amount: { ...typography.bodyBold, color: colors.textPrimary },
});
