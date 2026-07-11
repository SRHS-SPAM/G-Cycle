import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@components/buttons";
import { ErrorState, LoadingSpinner } from "@components/feedback";
import { useOrderDetail } from "@hooks/queries/useOrder";
import { colors, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

import type { ScanStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<ScanStackParamList, "OrderComplete">;

export default function OrderCompleteScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>주문이 완료됐어요</Text>
        <Text style={styles.body}>{order.storeName}에서 곧 준비를 시작해요.</Text>
        <Text style={styles.total}>{formatCurrency(order.totalPrice)}</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label="다 드셨나요? 반납 안내 보기"
          onPress={() =>
            (navigation.getParent() as any)?.navigate("MapTab", {
              screen: "ReturnGuide",
              params: { orderId: order.id },
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.xl },
  icon: { fontSize: 48 },
  title: { ...typography.h2, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  total: { ...typography.h3, color: colors.primary, marginTop: spacing.md },
  footer: { padding: spacing.xl },
});
