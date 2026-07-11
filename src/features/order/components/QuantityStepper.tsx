import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export function QuantityStepper({ quantity, onChange, max = 20 }: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => onChange(Math.max(0, quantity - 1))}
        hitSlop={8}
      >
        <Text style={styles.buttonText}>-</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable
        style={styles.button}
        onPress={() => onChange(Math.min(max, quantity + 1))}
        hitSlop={8}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { ...typography.h3, color: colors.primary },
  quantity: { ...typography.bodyBold, minWidth: 24, textAlign: "center" },
});
