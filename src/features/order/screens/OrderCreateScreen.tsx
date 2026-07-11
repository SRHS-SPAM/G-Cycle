import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { ErrorState, LoadingSpinner } from "@components/feedback";
import { ContainerInfoCard, MenuCard, OrderSummaryCard } from "@features/order/components";
import { useCreateOrder } from "@hooks/queries/useOrder";
import { useStoreMenu } from "@hooks/queries/useStores";
import { useOrderStore } from "@store/orderStore";
import { colors, spacing } from "@theme/index";

import type { ScanStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<ScanStackParamList, "OrderCreate">;

export default function OrderCreateScreen({ route, navigation }: Props) {
  const { storeId, containerCode } = route.params;
  const { data: menu, isLoading, isError, refetch } = useStoreMenu(storeId);
  const { startOrder, draftItems, setQuantity, totalPrice, clearOrder } = useOrderStore();
  const createOrder = useCreateOrder();

  useEffect(() => {
    startOrder(storeId, containerCode);
  }, [storeId, containerCode, startOrder]);

  const quantityFor = (menuItemId: string) =>
    draftItems.find((d) => d.menuItemId === menuItemId)?.quantity ?? 0;

  const handleSubmit = async () => {
    const order = await createOrder.mutateAsync({
      storeId,
      items: draftItems.map((d) => ({ menuItemId: d.menuItemId, quantity: d.quantity })),
    });
    clearOrder();
    navigation.replace("OrderComplete", { orderId: order.id });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !menu) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="메뉴 선택" />
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<ContainerInfoCard containerCode={containerCode} />}
        renderItem={({ item }) => (
          <MenuCard
            item={item}
            quantity={quantityFor(item.id)}
            onPress={() =>
              setQuantity(
                { menuItemId: item.id, name: item.name, price: item.price },
                quantityFor(item.id) + 1
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
      <View style={styles.footer}>
        {draftItems.length > 0 && (
          <OrderSummaryCard
            items={draftItems.map((d) => ({ name: d.name, quantity: d.quantity, price: d.price }))}
            totalPrice={totalPrice()}
          />
        )}
        <PrimaryButton
          label="주문하기"
          disabled={draftItems.length === 0}
          loading={createOrder.isPending}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl, gap: spacing.sm },
  footer: { padding: spacing.xl, gap: spacing.md },
});
