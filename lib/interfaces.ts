import {
  MintMaxVoteWeightSource,
  ProgramAccount,
  Realm,
} from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { MintMeta } from "./types";

export interface IRealm {
  imageUrl?: string;
  name: string;
  programId: PublicKey;
  account: ProgramAccount<Realm>;
  communityMint: MintMeta;
  councilMint?: MintMeta;
  authority?: PublicKey;
  votingProposalCount: number;
  communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
  minVoteWeightToCreateGovernance: BN;

  depositGoverningTokens: (amount: BN) => Promise<string>;
}
