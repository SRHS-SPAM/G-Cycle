import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { ErrorState, LoadingSpinner, StatusBadge } from "@components/feedback";
import { FillRateProgress } from "@features/rider/components";
import { useCollectionPointDetail } from "@hooks/queries/useCollectionPoints";
import { colors, spacing, typography } from "@theme/index";
import { formatDateTime } from "@utils/format";

// Shared by both MapStack (citizen) and RiderStack — kept loosely typed since
// it's mounted from two different param lists with the same shape.
interface Props {
  route: { params: { collectionPointId: string } };
  navigation: { goBack: () => void };
}

export default function CollectionPointDetailScreen({ route, navigation }: Props) {
  const { collectionPointId } = route.params;
  const { data: point, isLoading, isError, refetch } = useCollectionPointDetail(collectionPointId);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={navigation.goBack} title={point?.name ?? "수거함 정보"} />
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : isError || !point ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.fillLabel}>{Math.round(point.fillRate)}% 포화</Text>
            <StatusBadge
              label={point.fillRate >= 100 ? "가득 참" : "수거 가능"}
              tone={point.fillRate >= 100 ? "danger" : "success"}
            />
          </View>
          <FillRateProgress fillRate={point.fillRate} />
          <Text style={styles.meta}>수거 가능 용기 {point.currentCount}개 / 용량 {point.capacity}개</Text>
          <Text style={styles.address}>{point.address}</Text>
          {point.lastCollectedAt && (
            <Text style={styles.meta}>마지막 수거 {formatDateTime(point.lastCollectedAt)}</Text>
          )}
          {point.estimatedNextAvailableAt && (
            <Text style={styles.meta}>
              예상 수거 가능 시간 {formatDateTime(point.estimatedNextAvailableAt)}
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fillLabel: { ...typography.h2, color: colors.textPrimary },
  meta: { ...typography.body, color: colors.textSecondary },
  address: { ...typography.body, color: colors.textPrimary },
});
