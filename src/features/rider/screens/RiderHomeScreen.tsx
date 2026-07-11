import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ErrorState, LoadingSpinner } from "@components/feedback";
import { PickupTaskCard } from "@features/rider/components";
import { useRiderTasks } from "@hooks/queries/useRiderTasks";
import { useLocation } from "@hooks/useLocation";
import { useRiderStore } from "@store/riderStore";
import { colors, spacing, typography } from "@theme/index";

import type { RiderStackParamList } from "@app/navigation/types";
import type { RoutePriority } from "@features/rider/components/RoutePriorityChip";

type Props = NativeStackScreenProps<RiderStackParamList, "RiderHome">;

function priorityFor(distanceMeters?: number): RoutePriority {
  if (distanceMeters == null) return "FAR";
  if (distanceMeters < 300) return "ON_ROUTE";
  if (distanceMeters < 1000) return "NEARBY";
  return "FAR";
}

/** Rider's priority list: fill rate, route fit, and incentive all visible at once. */
export default function RiderHomeScreen({ navigation }: Props) {
  const { coords } = useLocation();
  const { data: tasks, isLoading, isError, refetch } = useRiderTasks(coords);
  const sortMode = useRiderStore((s) => s.sortMode);

  const sorted = useMemo(() => {
    if (!tasks) return [];
    return [...tasks].sort((a, b) => {
      if (sortMode === "FILL_RATE") return b.fillRate - a.fillRate;
      if (sortMode === "INCENTIVE") return b.incentiveAmount - a.incentiveAmount;
      return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity);
    });
  }, [tasks, sortMode]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>수거 작업</Text>
        <Text style={styles.subtitle}>동선에 맞는 수거함을 선택하세요</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !sorted.length ? (
        <EmptyState title="지금은 수거할 작업이 없어요" description="포화도가 높아지면 알려드릴게요." />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <PickupTaskCard
              task={item}
              priority={priorityFor(item.distanceMeters)}
              onPress={() => navigation.navigate("PickupTask", { taskId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, gap: spacing.xs },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
