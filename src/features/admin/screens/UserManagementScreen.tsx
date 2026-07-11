import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { StatusBadge } from "@components/feedback";
import { colors, spacing, typography } from "@theme/index";

import type { AdminStackParamList } from "@app/navigation/types";
import type { UserRole } from "@types/user";

type Props = NativeStackScreenProps<AdminStackParamList, "UserManagement">;

const MOCK_USERS: { id: string; name: string; role: UserRole }[] = [
  { id: "1", name: "김지사", role: "MEMBER" },
  { id: "2", name: "박라이더", role: "RIDER" },
  { id: "3", name: "이사장", role: "STORE_OWNER" },
];

export default function UserManagementScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="회원 관리" />
      <FlatList
        data={MOCK_USERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.name}</Text>
            <StatusBadge label={item.role} tone="neutral" />
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
