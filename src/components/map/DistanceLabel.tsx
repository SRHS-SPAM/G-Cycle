import { StyleSheet, Text } from "react-native";

import { colors, typography } from "@theme/index";
import { formatDistance } from "@utils/distance";

interface DistanceLabelProps {
  meters?: number;
}

export function DistanceLabel({ meters }: DistanceLabelProps) {
  if (meters == null) return null;
  return <Text style={styles.label}>{formatDistance(meters)}</Text>;
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.textSecondary },
});
