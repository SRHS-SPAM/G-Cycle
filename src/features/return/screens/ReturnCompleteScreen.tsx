import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@components/buttons";
import { useAuthStore } from "@store/authStore";
import { colors, spacing, typography } from "@theme/index";

import type { MapStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "ReturnComplete">;

export default function ReturnCompleteScreen({ navigation }: Props) {
  const role = useAuthStore((s) => s.role);
  const isMember = role === "MEMBER";

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>♻️</Text>
        <Text style={styles.title}>반납이 완료됐어요</Text>
        <Text style={styles.body}>
          {isMember
            ? "리워드가 적립됐어요. 지금 확인해보세요."
            : "회원가입하면 반납할 때마다 리워드를 받을 수 있어요."}
        </Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label={isMember ? "리워드 확인하기" : "회원가입하고 리워드 받기"}
          onPress={() =>
            isMember
              ? (navigation.getParent() as any)?.navigate("RewardTab", { screen: "Reward" })
              : (navigation.getParent()?.getParent() as any)?.navigate("Auth", { screen: "SignUp" })
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
  footer: { padding: spacing.xl },
});
