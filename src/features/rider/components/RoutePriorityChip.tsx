import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";

export type RoutePriority = "ON_ROUTE" | "NEARBY" | "FAR";

const labels: Record<RoutePriority, string> = {
  ON_ROUTE: "동선 위",
  NEARBY: "근처",
  FAR: "멀음",
};

interface RoutePriorityChipProps {
  priority: RoutePriority;
}

export function RoutePriorityChip({ priority }: RoutePriorityChipProps) {
  return (
    <View style={[styles.chip, priority === "ON_ROUTE" && styles.onRoute]}>
      <Text style={[styles.label, priority === "ON_ROUTE" && styles.onRouteLabel]}>
        {labels[priority]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  onRoute: { backgroundColor: colors.primaryLight },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: "700" },
  onRouteLabel: { color: colors.primaryDark },
});
