import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

interface IncentiveBadgeProps {
  amount: number;
}

export function IncentiveBadge({ amount }: IncentiveBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>+{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  label: { ...typography.caption, color: colors.textInverse, fontWeight: "800" },
});
