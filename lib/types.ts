import { Governance, ProgramAccount } from "@solana/spl-governance";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { Assets } from "./interfaces";

export type RealmMeta = {
  symbol: string;
  name: string;
  programId: PublicKey;
  realmId: PublicKey;
  website: string;
  ogImage: string;
};

export type MintMeta = {
  address: PublicKey;
  decimals: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  name?: string;
  symbol?: string;
};

export type InstructionSet = {
  instructions: TransactionInstruction[];
  preInstructions: TransactionInstruction[];
  postInstructions: TransactionInstruction[];
};

export type NativeTreasury = {
  address: PublicKey;
  lamports: BN;
  governance: ProgramAccount<Governance>;
  programId: PublicKey;
};

export type RealmWalletType = {
  governance: ProgramAccount<Governance>;
  nativeTreasury: NativeTreasury;
  assets: Assets;
};
