import { StyleSheet, View } from "react-native";

import { getFillColor } from "@theme/colors";
import { colors, radius } from "@theme/index";

interface FillRateProgressProps {
  fillRate: number;
}

export function FillRateProgress({ fillRate }: FillRateProgressProps) {
  const clamped = Math.min(100, Math.max(0, fillRate));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: getFillColor(clamped) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.full },
});
