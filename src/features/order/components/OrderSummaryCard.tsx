import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

interface OrderSummaryLine {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryCardProps {
  items: OrderSummaryLine[];
  totalPrice: number;
}

export function OrderSummaryCard({ items, totalPrice }: OrderSummaryCardProps) {
  return (
    <View style={styles.card}>
      {items.map((item) => (
        <View key={item.name} style={styles.row}>
          <Text style={styles.name}>
            {item.name} x{item.quantity}
          </Text>
          <Text style={styles.price}>{formatCurrency(item.price * item.quantity)}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>총 결제 금액</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { ...typography.body, color: colors.textPrimary },
  price: { ...typography.body, color: colors.textSecondary },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: { ...typography.bodyBold, color: colors.textPrimary },
  totalValue: { ...typography.bodyBold, color: colors.primary },
});
