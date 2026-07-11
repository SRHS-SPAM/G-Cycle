import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { AppHeader } from "@components/common";
import { colors, spacing, typography } from "@theme/index";

import type { MyStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<MyStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: Props) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} title="설정" />
      <View style={styles.row}>
        <Text style={styles.label}>푸시 알림</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.primary }} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>마케팅 알림</Text>
        <Switch
          value={marketingEnabled}
          onValueChange={setMarketingEnabled}
          trackColor={{ true: colors.primary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body, color: colors.textPrimary },
});
