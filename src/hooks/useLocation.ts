import * as Location from "expo-location";
import { useEffect, useState } from "react";

import { GANGNAM_DEFAULT_REGION } from "@constants/config";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Resolves the user's current coordinates. Falls back to a Gangnam-centered
 * default so map screens always have something to render immediately,
 * then swaps in the real fix once permission is granted.
 */
export function useLocation() {
  const [coords, setCoords] = useState<Coordinates>({
    latitude: GANGNAM_DEFAULT_REGION.latitude,
    longitude: GANGNAM_DEFAULT_REGION.longitude,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) {
          setPermissionDenied(true);
          setIsLoading(false);
        }
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      if (!cancelled) {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, isLoading, permissionDenied };
}
