import { PublicKey } from "@solana/web3.js";

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
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  name?: string;
  symbol?: string;
};
