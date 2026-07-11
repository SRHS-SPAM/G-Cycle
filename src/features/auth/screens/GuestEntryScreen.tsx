import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader, DONE_ACCESSORY_ID, KeyboardDoneAccessory } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { useAuthStore } from "@store/authStore";
import { colors, radius, spacing, typography } from "@theme/index";

import type { AuthStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "GuestEntry">;

/** Entry-barrier goal: a single phone number field, nothing else. */
export default function GuestEntryScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);

  const isValid = phoneNumber.replace(/[^0-9]/g, "").length >= 10;

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <AppHeader onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.title}>전화번호만 입력해주세요</Text>
          <Text style={styles.subtitle}>회원가입 없이 바로 주문하고 반납할 수 있어요.</Text>
          <TextInput
            style={styles.input}
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            returnKeyType="done"
            inputAccessoryViewID={DONE_ACCESSORY_ID}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={13}
          />
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            label="바로 주문하기"
            disabled={!isValid}
            onPress={() => {
              Keyboard.dismiss();
              loginAsGuest(phoneNumber);
            }}
          />
        </View>
      </SafeAreaView>
      <KeyboardDoneAccessory />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xl, gap: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
  },
  footer: { padding: spacing.xl },
});
