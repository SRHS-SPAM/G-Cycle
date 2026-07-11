import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { MapCard } from "@components/cards";
import { LoadingSpinner } from "@components/feedback";
import { CollectionPointMarker, FillRateBadge, StoreMarker, UserLocationMarker } from "@components/map";
import { useNearbyCollectionPoints } from "@hooks/queries/useCollectionPoints";
import { useNearbyStores } from "@hooks/queries/useStores";
import { useLocation } from "@hooks/useLocation";
import { colors, spacing } from "@theme/index";
import { formatDistance } from "@utils/distance";

import type { HomeStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

/**
 * The home screen IS the map. Nearest store + nearest collection point float
 * as cards on top so the 3 core actions (order / check bin / return) are
 * visible within the first 3 seconds, per the product brief.
 */
export default function HomeScreen({ navigation }: Props) {
  const { coords, isLoading: locationLoading } = useLocation();
  const { data: stores, isLoading: storesLoading } = useNearbyStores(coords);
  const { data: points, isLoading: pointsLoading } = useNearbyCollectionPoints(coords);

  const nearestStore = useMemo(() => stores?.[0], [stores]);
  const nearestPoint = useMemo(() => points?.[0], [points]);

  if (locationLoading || storesLoading || pointsLoading) {
    return <LoadingSpinner fullScreen />;
  }

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
        {stores?.map((store) => (
          <StoreMarker
            key={store.id}
            store={store}
            onPress={() => navigation.navigate("StoreDetail", { storeId: store.id })}
          />
        ))}
        {points?.map((point) => (
          <CollectionPointMarker key={point.id} point={point} />
        ))}
      </MapView>

      <SafeAreaView style={styles.cardStack} pointerEvents="box-none">
        {nearestStore && (
          <MapCard
            title={nearestStore.name}
            subtitle={`가장 가까운 매장 · ${formatDistance(nearestStore.distanceMeters)}`}
            onPress={() => navigation.navigate("StoreDetail", { storeId: nearestStore.id })}
          />
        )}
        {nearestPoint && (
          <MapCard
            title={nearestPoint.name}
            subtitle={`가장 가까운 수거함 · ${formatDistance(nearestPoint.distanceMeters)}`}
            right={<FillRateBadge fillRate={nearestPoint.fillRate} />}
            onPress={() => navigation.navigate("StoreMap")}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cardStack: { position: "absolute", top: 0, left: 0, right: 0, padding: spacing.lg, gap: spacing.sm },
});
