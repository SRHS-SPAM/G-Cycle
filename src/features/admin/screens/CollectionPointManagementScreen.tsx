import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { FillRateBadge } from "@components/map";
import { colors, spacing, typography } from "@theme/index";

import type { AdminStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "CollectionPointManagement">;

const MOCK_POINTS = [
  { id: "1", name: "강남역 2번 출구 수거함", fillRate: 82 },
  { id: "2", name: "신논현역 수거함", fillRate: 34 },
  { id: "3", name: "역삼동 주민센터 수거함", fillRate: 58 },
];

export default function CollectionPointManagementScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="수거함 관리" />
      <FlatList
        data={MOCK_POINTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.name}</Text>
            <FillRateBadge fillRate={item.fillRate} />
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
  label: { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
});
