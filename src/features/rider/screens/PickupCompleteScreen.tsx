import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@components/buttons";
import { useCompleteTask } from "@hooks/queries/useRiderTasks";
import { colors, radius, spacing, typography } from "@theme/index";
import { formatCurrency } from "@utils/format";

import type { RiderStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<RiderStackParamList, "PickupComplete">;

export default function PickupCompleteScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const [collectedCount, setCollectedCount] = useState("0");
  const completeTask = useCompleteTask();
  const [done, setDone] = useState(false);

  const handleComplete = async () => {
    await completeTask.mutateAsync({
      taskId,
      collectedCount: Number(collectedCount) || 0,
      handoverLocation: "WASHING_FACTORY",
    });
    setDone(true);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.icon}>🚴</Text>
          <Text style={styles.title}>수거가 완료됐어요</Text>
          <Text style={styles.body}>인센티브가 곧 지급돼요.</Text>
          <Text style={styles.incentive}>{formatCurrency(2000)}</Text>
        </View>
        <View style={styles.footer}>
          <PrimaryButton label="다음 작업 보기" onPress={() => navigation.popToTop()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>수거한 용기 수량을 입력하세요</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={collectedCount}
          onChangeText={setCollectedCount}
        />
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="수거 완료" loading={completeTask.isPending} onPress={handleComplete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.xl },
  icon: { fontSize: 48 },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: "center" },
  body: { ...typography.body, color: colors.textSecondary },
  incentive: { ...typography.h1, color: colors.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    width: 120,
    textAlign: "center",
    ...typography.h2,
  },
  footer: { padding: spacing.xl },
});
