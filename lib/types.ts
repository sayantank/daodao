import { PublicKey } from "@solana/web3.js";

export type RealmMeta = {
  symbol: string;
  name: string;
  programId: PublicKey;
  realmId: PublicKey;
  website: string;
  ogImage: string;
};
