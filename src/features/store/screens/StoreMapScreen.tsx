import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import { AppHeader } from "@components/common";
import { StoreMarker, UserLocationMarker } from "@components/map";
import { useNearbyStores } from "@hooks/queries/useStores";
import { useLocation } from "@hooks/useLocation";
import { colors } from "@theme/index";

import type { HomeStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "StoreMap">;

/** Full-screen map dedicated to browsing partner stores (vs. the mixed Home map). */
export default function StoreMapScreen({ navigation }: Props) {
  const { coords } = useLocation();
  const { data: stores } = useNearbyStores(coords);

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
      </MapView>
      <AppHeader onBack={() => navigation.goBack()} title="제휴 매장" transparent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
