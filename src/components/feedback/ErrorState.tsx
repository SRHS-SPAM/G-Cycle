import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@components/buttons";
import { colors, spacing, typography } from "@theme/index";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "문제가 발생했어요. 다시 시도해주세요.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <View style={styles.retryButton}>
          <PrimaryButton label="다시 시도" onPress={onRetry} fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.md },
  message: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  retryButton: { minWidth: 140 },
});
