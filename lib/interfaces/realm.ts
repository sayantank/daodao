import {
  Governance,
  MintMaxVoteWeightSource,
  ProgramAccount,
  Proposal,
  Realm,
} from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  InstructionSet,
  MintMeta,
  NativeTreasury,
  RealmWalletType,
} from "../types";
import { Assets } from "./asset";

export interface IRealm {
  id: string;
  imageUrl?: string;
  name: string;
  address: PublicKey;
  programId: PublicKey;
  programVersion: number;
  account: ProgramAccount<Realm>;
  communityMint: MintMeta;
  councilMint?: MintMeta;
  authority?: PublicKey;
  votingProposalCount: number;
  communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
  minVoteWeightToCreateGovernance: BN;
  governances: ProgramAccount<Governance>[];
  proposals: ProgramAccount<Proposal>[];
  nativeTreasuries: NativeTreasury[];
  assets: Assets;

  TreasurySummaryCard: () => JSX.Element | null;
  VoterInfo: () => JSX.Element | null;

  getRealmWallets(): Record<string, RealmWalletType>;

  canCreateProposal(
    owner: PublicKey,
    governance: ProgramAccount<Governance>
  ): boolean;

  getDepositCommunityTokenInstructions(
    connection: Connection,
    amount: BN,
    owner: PublicKey
  ): Promise<InstructionSet>;
}
