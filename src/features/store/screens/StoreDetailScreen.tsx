import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { ErrorState, LoadingSpinner, StatusBadge } from "@components/feedback";
import { useStoreDetail } from "@hooks/queries/useStores";
import { colors, spacing, typography } from "@theme/index";

import type { HomeStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "StoreDetail">;

export default function StoreDetailScreen({ route, navigation }: Props) {
  const { storeId } = route.params;
  const { data: store, isLoading, isError, refetch } = useStoreDetail(storeId);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title={store?.name ?? "매장 정보"} />
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : isError || !store ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{store.name}</Text>
              <StatusBadge label={store.isOpen ? "영업중" : "영업종료"} tone={store.isOpen ? "success" : "neutral"} />
            </View>
            <Text style={styles.address}>{store.address}</Text>
            <Text style={styles.stock}>다회용기 재고 {store.containerStock}개</Text>
          </ScrollView>
          <View style={styles.footer}>
            <PrimaryButton
              label="QR로 주문하기"
              disabled={!store.isOpen}
              onPress={() =>
                // Cross-tab jump: typed navigation across independent stacks needs a cast.
                (navigation.getParent() as any)?.navigate("ScanTab", { screen: "QRScan" })
              }
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.sm },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { ...typography.h2, color: colors.textPrimary },
  address: { ...typography.body, color: colors.textSecondary },
  stock: { ...typography.body, color: colors.textPrimary },
  footer: { padding: spacing.xl },
});
