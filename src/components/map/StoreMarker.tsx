import { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@theme/index";

import type { Store } from "@types/store";

interface StoreMarkerProps {
  store: Store;
  onPress?: () => void;
}

export function StoreMarker({ store, onPress }: StoreMarkerProps) {
  return (
    <Marker
      coordinate={store.location}
      onPress={onPress}
      title={store.name}
      tracksViewChanges={false}
    >
      <View style={styles.pin}>
        <Text style={styles.icon}>☕</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 16 },
});
