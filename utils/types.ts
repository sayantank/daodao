import { KeyedMutator } from "swr";

export type SWRHookReturnType<T> = {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<T>;
};