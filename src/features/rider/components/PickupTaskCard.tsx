import { Pressable, StyleSheet, Text, View } from "react-native";

import { FillRateBadge } from "@components/map";
import { colors, radius, spacing, typography } from "@theme/index";
import { formatDistance } from "@utils/distance";

import { IncentiveBadge } from "./IncentiveBadge";
import { RoutePriorityChip, type RoutePriority } from "./RoutePriorityChip";

import type { PickupTask } from "@types/rider";

interface PickupTaskCardProps {
  task: PickupTask;
  priority: RoutePriority;
  onPress: () => void;
}

export function PickupTaskCard({ task, priority, onPress }: PickupTaskCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {task.collectionPointName}
        </Text>
        <RoutePriorityChip priority={priority} />
      </View>
      <View style={styles.metaRow}>
        <FillRateBadge fillRate={task.fillRate} />
        <Text style={styles.dot}>·</Text>
        <Text style={styles.meta}>용기 {task.containerCount}개</Text>
        {task.distanceMeters != null && (
          <>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>{formatDistance(task.distanceMeters)}</Text>
          </>
        )}
      </View>
      <IncentiveBadge amount={task.incentiveAmount} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { ...typography.bodyBold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  meta: { ...typography.caption, color: colors.textSecondary },
  dot: { color: colors.textSecondary },
});
