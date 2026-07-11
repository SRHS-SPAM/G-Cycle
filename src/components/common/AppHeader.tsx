import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing, typography } from "@theme/index";

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
}

/** Kept intentionally thin per the style guide — the map/content should dominate the screen. */
export function AppHeader({ title, onBack, right, transparent }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm },
        transparent && styles.transparent,
      ]}
    >
      <View style={styles.side}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={[styles.side, styles.rightSide]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  transparent: { backgroundColor: "transparent" },
  side: { width: 40 },
  rightSide: { alignItems: "flex-end" },
  title: { flex: 1, textAlign: "center", ...typography.h3, color: colors.textPrimary },
});
