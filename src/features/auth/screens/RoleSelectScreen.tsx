import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, SecondaryButton } from "@components/buttons";
import { colors, spacing, typography } from "@theme/index";

import type { AuthStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "RoleSelect">;

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>어떻게 시작할까요?</Text>
        <Text style={styles.subtitle}>가장 빠른 방법은 전화번호만 입력하는 게스트 진입이에요.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="바로 주문하기 (게스트)" onPress={() => navigation.navigate("GuestEntry")} />
        <SecondaryButton label="로그인하고 리워드 받기" onPress={() => navigation.navigate("Login")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: "space-between" },
  header: { gap: spacing.sm, marginTop: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary },
  actions: { gap: spacing.sm, marginBottom: spacing.xl },
});
