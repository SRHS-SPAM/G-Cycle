import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@theme/index";

/** Shown while auth state hydrates from secure storage — kept brand-only, no spinner text. */
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>G-Cycle</Text>
      <Text style={styles.tagline}>지사이클</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logo: { ...typography.h1, color: colors.textInverse },
  tagline: { ...typography.body, color: colors.textInverse },
});
