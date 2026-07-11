import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, SecondaryButton } from "@components/buttons";
import { useAuthStore } from "@store/authStore";
import { colors, radius, spacing, typography } from "@theme/index";

import type { MyStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<MyStackParamList, "My">;

const MENU_ITEMS = ["이용 내역", "알림 설정", "약관 및 정책", "고객센터"];

export default function MyScreen({ navigation }: Props) {
  const { isGuest, role, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>{isGuest ? "게스트로 이용 중" : `${role} 회원`}</Text>
      </View>

      {isGuest && (
        <View style={styles.upsell}>
          <Text style={styles.upsellText}>회원가입하면 리워드와 이용 내역을 쌓을 수 있어요.</Text>
          <PrimaryButton label="회원가입" onPress={() => {}} fullWidth={false} />
        </View>
      )}

      <View style={styles.menuGroup}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item} style={styles.menuRow}>
            <Text style={styles.menuLabel}>{item}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.menuRow} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.menuLabel}>설정</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <SecondaryButton label={isGuest ? "게스트 종료" : "로그아웃"} onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, gap: spacing.xs },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary },
  upsell: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  upsellText: { ...typography.body, color: colors.primaryDark },
  menuGroup: { marginTop: spacing.xl },
  menuRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { ...typography.body, color: colors.textPrimary },
  footer: { padding: spacing.xl, marginTop: "auto" },
});
