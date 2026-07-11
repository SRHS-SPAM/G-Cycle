import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/common";
import { PrimaryButton } from "@components/buttons";
import { LoadingSpinner, StatusBadge } from "@components/feedback";
import { CollectionPointMarker, DistanceLabel, UserLocationMarker } from "@components/map";
import { useNearbyCollectionPoints } from "@hooks/queries/useCollectionPoints";
import { useLocation } from "@hooks/useLocation";
import { colors, spacing, typography } from "@theme/index";

import type { MapStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<MapStackParamList, "ReturnGuide">;

/** Tells the citizen exactly where to return the container, no browsing required. */
export default function ReturnGuideScreen({ navigation }: Props) {
  const { coords, isLoading: locationLoading } = useLocation();
  const { data: points, isLoading } = useNearbyCollectionPoints(coords);
  const nearest = points?.[0];

  if (locationLoading || isLoading) return <LoadingSpinner fullScreen />;

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: nearest?.latitude ?? coords.latitude,
          longitude: nearest?.longitude ?? coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <UserLocationMarker coordinate={coords} />
        {nearest && <CollectionPointMarker point={nearest} />}
      </MapView>
      <AppHeader onBack={() => navigation.goBack()} title="반납 안내" transparent />

      {nearest && (
        <SafeAreaView style={styles.card} pointerEvents="box-none">
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{nearest.name}</Text>
              <StatusBadge
                label={nearest.fillRate >= 100 ? "가득 참" : "수거 가능"}
                tone={nearest.fillRate >= 100 ? "danger" : "success"}
              />
            </View>
            <DistanceLabel meters={nearest.distanceMeters} />
            <PrimaryButton
              label="반납 완료 처리"
              disabled={nearest.fillRate >= 100}
              onPress={() =>
                navigation.replace("ReturnComplete", { collectionPointId: nearest.id })
              }
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.lg },
  cardInner: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { ...typography.bodyBold, color: colors.textPrimary },
});
