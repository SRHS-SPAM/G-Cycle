import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "@theme/index";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center", justifyContent: "center" },
  fullScreen: { flex: 1 },
});
