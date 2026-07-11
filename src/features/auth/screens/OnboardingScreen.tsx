import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, SecondaryButton } from "@components/buttons";
import { colors, spacing, typography } from "@theme/index";

import type { AuthStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const SLIDES = [
  { title: "QR 하나로 주문부터 반납까지", body: "강남 제휴 매장에서 다회용기로 주문하고, 가까운 수거함에 반납하세요." },
  { title: "포화도를 실시간으로 확인", body: "수거함이 얼마나 찼는지 지도에서 바로 확인할 수 있어요." },
  { title: "반납하면 리워드 적립", body: "회원이면 반납할 때마다 리워드가 쌓여요." },
];

/** Kept to 2-3 slides max per the design brief — the goal is fast entry, not a long pitch. */
export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          label={isLast ? "시작하기" : "다음"}
          onPress={() => (isLast ? navigation.replace("RoleSelect") : setIndex(index + 1))}
        />
        {!isLast && (
          <SecondaryButton label="건너뛰기" onPress={() => navigation.replace("RoleSelect")} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  content: { flex: 1, justifyContent: "center", gap: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textSecondary },
  dots: { flexDirection: "row", gap: spacing.xs, marginTop: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  actions: { gap: spacing.sm },
});
