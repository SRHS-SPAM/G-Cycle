import { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

import { getFillColor } from "@theme/colors";
import { colors } from "@theme/index";

import type { CollectionPoint } from "@types/collectionPoint";

interface CollectionPointMarkerProps {
  point: CollectionPoint;
  onPress?: () => void;
}

/** Marker color reflects fill rate so riders can scan the map at a glance. */
export function CollectionPointMarker({ point, onPress }: CollectionPointMarkerProps) {
  const color = getFillColor(point.fillRate);
  return (
    <Marker
      coordinate={{ latitude: point.latitude, longitude: point.longitude }}
      onPress={onPress}
      title={point.name}
      description={`${Math.round(point.fillRate)}% 포화`}
      tracksViewChanges={false}
    >
      <View style={[styles.pin, { backgroundColor: color }]}>
        <Text style={styles.label}>{Math.round(point.fillRate)}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  label: { color: colors.textInverse, fontWeight: "800", fontSize: 12 },
});
