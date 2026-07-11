import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authApi } from "@api/auth";
import { AppHeader } from "@components/common";
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

  const handleSignUp = async () => {
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
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="회원가입" />
      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="이름" value={name} onChangeText={setName} />
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
        <PrimaryButton label="가입하기" loading={loading} onPress={handleSignUp} />
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
});
