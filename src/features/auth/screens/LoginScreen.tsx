import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authApi } from "@api/auth";
import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { useAuthStore } from "@store/authStore";
import { useUiStore } from "@store/uiStore";
import { colors, radius, spacing, typography } from "@theme/index";

import type { AuthStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loginAsMember = useAuthStore((s) => s.loginAsMember);
  const showToast = useUiStore((s) => s.showToast);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const tokens = await authApi.login({ phoneNumber, password });
      await loginAsMember(tokens, tokens.role);
    } catch {
      showToast("로그인에 실패했어요. 정보를 다시 확인해주세요.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="로그인" />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="전화번호"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <PrimaryButton label="로그인" loading={loading} onPress={handleLogin} />
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpLink}>아직 회원이 아니신가요? 회원가입</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
  signUpLink: { ...typography.caption, color: colors.primary, textAlign: "center" },
});
