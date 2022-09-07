import {
  ProgramAccount,
  Realm as SPLRealm,
  getRealm,
} from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";

export class Realm {
  private _programId: PublicKey;
  private _account: ProgramAccount<SPLRealm>;

  constructor(programId: PublicKey, account: ProgramAccount<SPLRealm>) {
    this._programId = programId;
    this._account = account;
  }

  public get programId(): PublicKey {
    return this._programId;
  }

  public get account(): ProgramAccount<SPLRealm> {
    return this._account;
  }

  static async load(
    connection: Connection,
    realmId: PublicKey,
    programId: PublicKey
  ): Promise<Realm> {
    const realmAccount = await getRealm(connection, realmId);
    return new Realm(programId, realmAccount);
  }
}
