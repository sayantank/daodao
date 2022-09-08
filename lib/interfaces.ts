import { ProgramAccount, Realm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export interface IRealm {
  programId: PublicKey;
  account: ProgramAccount<Realm>;

  depositGoverningTokens: (amount: BN) => Promise<string>;
}
