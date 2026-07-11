import { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import { colors } from "@theme/index";

interface UserLocationMarkerProps {
  coordinate: { latitude: number; longitude: number };
}

export function UserLocationMarker({ coordinate }: UserLocationMarkerProps) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
      <View style={styles.outer}>
        <View style={styles.inner} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(59,130,246,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.info,
    borderWidth: 2,
    borderColor: colors.background,
  },
});
