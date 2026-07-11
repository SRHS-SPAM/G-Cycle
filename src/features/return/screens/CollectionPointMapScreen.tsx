import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import { AppHeader } from "@components/common";
import { CollectionPointMarker, UserLocationMarker } from "@components/map";
import { useNearbyCollectionPoints } from "@hooks/queries/useCollectionPoints";
import { useLocation } from "@hooks/useLocation";
import { colors } from "@theme/index";

import type { MapStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "CollectionPointMap">;

/**
 * Dedicated collection-point map: shows fill rate, collectible count, last
 * pickup time via markers + tap-through detail, per the product brief.
 */
export default function CollectionPointMapScreen({ navigation }: Props) {
  const { coords } = useLocation();
  const { data: points } = useNearbyCollectionPoints(coords);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <UserLocationMarker coordinate={coords} />
        {points?.map((point) => (
          <CollectionPointMarker
            key={point.id}
            point={point}
            onPress={() =>
              navigation.navigate("CollectionPointDetail", { collectionPointId: point.id })
            }
          />
        ))}
      </MapView>
      <AppHeader title="수거함 지도" transparent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
