import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";

interface ContainerInfoCardProps {
  containerCode?: string;
}

/** Reminds the citizen this order rides in a tracked reusable container, not disposables. */
export function ContainerInfoCard({ containerCode }: ContainerInfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>다회용기로 제공돼요</Text>
      <Text style={styles.body}>
        이 매장은 전용 다회용기로만 포장해요. 다 드신 후 가까운 수거함에 반납해주세요.
      </Text>
      {containerCode && <Text style={styles.code}>용기 코드 {containerCode}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  title: { ...typography.bodyBold, color: colors.primaryDark },
  body: { ...typography.caption, color: colors.textSecondary },
  code: { ...typography.caption, color: colors.primaryDark, fontWeight: "700" },
});
