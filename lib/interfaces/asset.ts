import { Governance, ProgramAccount } from "@solana/spl-governance";
import { Mint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export enum AssetType {
  Mint = "mint",
  Program = "program",
  TokenAccount = "tokenAccount",
}

interface BaseAssetType {
  address: PublicKey;
  governance: ProgramAccount<Governance>;
  type: AssetType;
}

export interface MintAssetType extends BaseAssetType {
  decimals: number;
  mintAuthority: PublicKey | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProgramAssetType extends BaseAssetType {}

export interface TokenAccountAssetType extends BaseAssetType {
  owner: PublicKey;
  balance: BN;
  mint: Mint;
}

export type Assets = {
  mintAssets: MintAssetType[];
  programAssets: ProgramAssetType[];
  tokenAccountAssets: TokenAccountAssetType[];
};
