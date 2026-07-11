import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { containerApi } from "@api/container";
import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { useUiStore } from "@store/uiStore";
import { colors, radius, spacing, typography } from "@theme/index";

import type { StoreOwnerStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<StoreOwnerStackParamList, "ContainerIssue">;

// NOTE: storeId should come from the authenticated store-owner session once
// that endpoint exists; hardcoded here for the frontend-first scaffold.
const CURRENT_STORE_ID = "current-store";

export default function ContainerIssueScreen({ navigation }: Props) {
  const [count, setCount] = useState("10");
  const [loading, setLoading] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const handleIssue = async () => {
    setLoading(true);
    try {
      await containerApi.issue(CURRENT_STORE_ID, Number(count) || 0);
      showToast("용기가 발급됐어요.", "success");
    } catch {
      showToast("발급에 실패했어요.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="다회용기 발급/회수" />
      <View style={styles.content}>
        <Text style={styles.label}>발급할 용기 수량</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={count}
          onChangeText={setCount}
        />
        <PrimaryButton label="발급하기" loading={loading} onPress={handleIssue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  label: { ...typography.body, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
  },
});
