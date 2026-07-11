import { StyleSheet, Text, View } from "react-native";

import { getFillColor } from "@theme/colors";
import { radius, spacing, typography } from "@theme/index";

interface FillRateBadgeProps {
  fillRate: number;
}

/** Shows "80% 포화" style label with the color-coded dot from the style guide. */
export function FillRateBadge({ fillRate }: FillRateBadgeProps) {
  const color = getFillColor(fillRate);
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{Math.round(fillRate)}% 포화</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: radius.full },
  label: { ...typography.caption, fontWeight: "700" },
});
