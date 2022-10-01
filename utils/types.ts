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

/**
 * @param quorum no of atomic tokens required to reach quorum
 * @param quorumPercentage percentage of yes votes required to pass
 * @param maxVotes maximum number of atomic tokens that can vote
 * @param yesVotes number of atomic tokens that voted yes
 * @param tokenDecimals number of decimals in the governing token
 * @param percentage percentage of yes votes / max votes
 */
export type ApprovalQuorumInfo = {
  quorum: BN;
  quorumPercentage: number;
  maxVotes: BN;
  yesVotes: BN;
  percentage: number;
  tokenDecimals: number;
  currentQuorumPercentage: number;
};

export enum TokenOwnerRecordAction {
  Deposit = "deposit",
  Withdraw = "withdraw",
}
