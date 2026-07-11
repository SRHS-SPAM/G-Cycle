import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@theme/index";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.sm },
  title: { ...typography.h3, color: colors.textPrimary, textAlign: "center" },
  description: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
});
