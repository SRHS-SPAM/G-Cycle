import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { ErrorState, LoadingSpinner } from "@components/feedback";
import { FillRateProgress, IncentiveBadge } from "@features/rider/components";
import { useClaimTask } from "@hooks/queries/useRiderTasks";
import { useCollectionPointDetail } from "@hooks/queries/useCollectionPoints";
import { colors, spacing, typography } from "@theme/index";

import type { RiderStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<RiderStackParamList, "PickupTask">;

export default function PickupTaskScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  // In this scaffold, the pickup task's collection point shares the task id
  // scheme; swap for a dedicated useTaskDetail hook once the endpoint exists.
  const { data: point, isLoading, isError, refetch } = useCollectionPointDetail(taskId);
  const claimTask = useClaimTask();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    await claimTask.mutateAsync(taskId);
    setClaimed(true);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !point) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title={point.name} />
      <View style={styles.content}>
        <FillRateProgress fillRate={point.fillRate} />
        <Text style={styles.meta}>수거 가능 용기 {point.currentCount}개</Text>
        <Text style={styles.address}>{point.address}</Text>
        <IncentiveBadge amount={2000} />
      </View>
      <View style={styles.footer}>
        {!claimed ? (
          <PrimaryButton label="이 작업 맡기" loading={claimTask.isPending} onPress={handleClaim} />
        ) : (
          <PrimaryButton
            label="수거 완료 처리"
            onPress={() => navigation.replace("PickupComplete", { taskId })}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.sm },
  meta: { ...typography.body, color: colors.textSecondary },
  address: { ...typography.body, color: colors.textPrimary },
  footer: { padding: spacing.xl },
});
