import { useQuery } from "@tanstack/react-query";

import { collectionPointApi } from "@api/collectionPoint";

import type { Coordinates } from "@hooks/useLocation";

/** Short refetch interval keeps fill-rate close to real time on the map screen. */
export function useNearbyCollectionPoints(coords: Coordinates) {
  return useQuery({
    queryKey: ["collectionPoints", "nearby", coords.latitude, coords.longitude],
    queryFn: () => collectionPointApi.list(coords),
    refetchInterval: 30000,
  });
}

export function useCollectionPointDetail(id: string) {
  return useQuery({
    queryKey: ["collectionPoints", id],
    queryFn: () => collectionPointApi.detail(id),
    enabled: !!id,
    refetchInterval: 15000,
  });
}
