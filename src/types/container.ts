export type ContainerStatus = "ISSUED" | "IN_USE" | "RETURNED" | "COLLECTED" | "WASHING";

export interface Container {
  id: string;
  code: string;
  storeId: string;
  status: ContainerStatus;
  issuedAt: string;
  returnedAt?: string;
}
