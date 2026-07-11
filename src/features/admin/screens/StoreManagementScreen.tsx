import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { StatusBadge } from "@components/feedback";
import { colors, spacing, typography } from "@theme/index";

import type { AdminStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "StoreManagement">;

const MOCK_STORES = [
  { id: "1", name: "그린카페 강남점", isOpen: true },
  { id: "2", name: "에코샐러드 역삼점", isOpen: true },
  { id: "3", name: "지사이클 분식 논현점", isOpen: false },
];

export default function StoreManagementScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="매장 관리" />
      <FlatList
        data={MOCK_STORES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.name}</Text>
            <StatusBadge label={item.isOpen ? "영업중" : "영업종료"} tone={item.isOpen ? "success" : "neutral"} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body, color: colors.textPrimary },
});
