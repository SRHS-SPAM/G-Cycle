import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authApi } from "@api/auth";
import { AppHeader, DONE_ACCESSORY_ID, KeyboardDoneAccessory } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { useAuthStore } from "@store/authStore";
import { useUiStore } from "@store/uiStore";
import { colors, radius, spacing, typography } from "@theme/index";

import type { AuthStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loginAsMember = useAuthStore((s) => s.loginAsMember);
  const showToast = useUiStore((s) => s.showToast);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const tokens = await authApi.signUp({ name, phoneNumber, password });
      await loginAsMember(tokens, tokens.role);
    } catch {
      showToast("회원가입에 실패했어요.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <AppHeader onBack={() => navigation.goBack()} title="회원가입" />
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="이름"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            blurOnSubmit={false}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            ref={phoneRef}
            style={styles.input}
            placeholder="전화번호"
            keyboardType="phone-pad"
            returnKeyType="next"
            inputAccessoryViewID={DONE_ACCESSORY_ID}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            value={password}
            onChangeText={setPassword}
          />
          <PrimaryButton label="가입하기" loading={loading} onPress={handleSignUp} />
        </View>
      </SafeAreaView>
      <KeyboardDoneAccessory />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
  },
});
