import { useQuery } from "@tanstack/react-query";

import { storeApi } from "@api/store";

import type { Coordinates } from "@hooks/useLocation";

export function useNearbyStores(coords: Coordinates) {
  return useQuery({
    queryKey: ["stores", "nearby", coords.latitude, coords.longitude],
    queryFn: () => storeApi.list(coords),
  });
}

export function useStoreDetail(storeId: string) {
  return useQuery({
    queryKey: ["stores", storeId],
    queryFn: () => storeApi.detail(storeId),
    enabled: !!storeId,
  });
}

export function useStoreMenu(storeId: string) {
  return useQuery({
    queryKey: ["stores", storeId, "menu"],
    queryFn: () => storeApi.menu(storeId),
    enabled: !!storeId,
  });
}
