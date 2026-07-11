export interface StoreLocation {
  latitude: number;
  longitude: number;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  location: StoreLocation;
  isOpen: boolean;
  imageUrl?: string;
  distanceMeters?: number;
  containerStock: number;
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  price: number;
  imageUrl?: string;
  containerRequired: boolean;
}
