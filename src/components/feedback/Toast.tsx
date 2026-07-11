import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUiStore } from "@store/uiStore";
import { colors, radius, spacing, typography } from "@theme/index";

const toneBg: Record<string, string> = {
  success: colors.primary,
  error: colors.danger,
  info: colors.textPrimary,
};

/** Single global toast, driven by uiStore — this is what apiClient's error interceptor triggers. */
export function Toast() {
  const toast = useUiStore((s) => s.toast);
  const hideToast = useUiStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(hideToast, 2500);
    return () => clearTimeout(timer);
  }, [toast.visible, hideToast]);

  if (!toast.visible) return null;

  return (
    <SafeAreaView style={styles.wrapper} pointerEvents="none">
      <View style={[styles.toast, { backgroundColor: toneBg[toast.variant] }]}>
        <Text style={styles.message}>{toast.message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" },
  toast: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    maxWidth: "90%",
  },
  message: { ...typography.body, color: colors.textInverse, textAlign: "center" },
});
