import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

import type { MenuItem } from "@types/store";

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onPress: () => void;
}

export function MenuCard({ item, quantity, onPress }: MenuCardProps) {
  return (
    <Pressable style={[styles.card, quantity > 0 && styles.cardSelected]} onPress={onPress}>
      <View style={styles.textGroup}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        {item.containerRequired && <Text style={styles.containerNote}>다회용기 필수</Text>}
      </View>
      {quantity > 0 && (
        <View style={styles.qtyBadge}>
          <Text style={styles.qtyText}>{quantity}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  textGroup: { flex: 1, gap: 2 },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  price: { ...typography.body, color: colors.textSecondary },
  containerNote: { ...typography.caption, color: colors.primaryDark },
  qtyBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: colors.textInverse, fontWeight: "800" },
});
