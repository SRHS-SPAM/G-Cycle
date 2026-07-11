import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@theme/index";

export const DONE_ACCESSORY_ID = "gcycle-done-accessory";

/**
 * iOS's numeric/phone-pad keyboards have no built-in Return/Done key, so a
 * field using keyboardType="phone-pad" or "number-pad" can get stuck open
 * with no obvious way to close it. This renders a small "완료" bar above the
 * keyboard on iOS; pair it with a TextInput that sets
 * inputAccessoryViewID={DONE_ACCESSORY_ID}. Android already gets a usable key
 * via returnKeyType, so this renders nothing there.
 */
export function KeyboardDoneAccessory() {
  if (Platform.OS !== "ios") return null;

  return (
    <InputAccessoryView nativeID={DONE_ACCESSORY_ID}>
      <View style={styles.bar}>
        <Pressable onPress={Keyboard.dismiss} hitSlop={8}>
          <Text style={styles.label}>완료</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "flex-end",
  },
  label: { ...typography.bodyBold, color: colors.primary },
});
