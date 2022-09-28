import BN from "bn.js";
import { KeyedMutator } from "swr";

export type SWRHookReturnType<T> = {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<T>;
};

export type DropdownOption<T> = {
  label: string;
  value: T;
};

export type BadgeProps = {
  style?: string;
  dot?: string;
  children: React.ReactNode;
};

export type TimeDelta = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type ApprovalQuorumInfo = {
  quorum: BN;
  quorumPercentage: number;
  maxVotes: BN;
  yesVotes: BN;
  percentage: number;
  tokenDecimals: number;
};
