import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";

export type StatusBadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone: StatusBadgeTone;
}

const toneColors: Record<StatusBadgeTone, { bg: string; fg: string }> = {
  success: { bg: colors.primaryLight, fg: colors.primaryDark },
  warning: { bg: "#FEF3C7", fg: "#92400E" },
  danger: { bg: "#FEE2E2", fg: "#991B1B" },
  info: { bg: "#DBEAFE", fg: "#1E40AF" },
  neutral: { bg: colors.surface, fg: colors.textSecondary },
};

/** Green/yellow/red badge used everywhere a state needs to read at a glance. */
export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const { bg, fg } = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  label: { ...typography.caption, fontWeight: "700" },
});
