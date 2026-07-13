export type StoreStatus = "idle" | "loading" | "success" | "error";

export interface AsyncStoreState {
  status: StoreStatus;
  error: string | null;
}

export const initialAsyncState: AsyncStoreState = {
  status: "idle",
  error: null,
};
