import { ProgramAccount, Realm, getRealm } from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";
import { arePubkeysEqual } from "@utils/general";
import { LibError } from "./errors";

export class BasicRealm {
  private _programId: PublicKey;
  private _account: ProgramAccount<Realm>;

  constructor(programId: PublicKey, account: ProgramAccount<Realm>) {
    this._programId = programId;
    this._account = account;
  }

  public get programId(): PublicKey {
    return this._programId;
  }

  public get account(): ProgramAccount<Realm> {
    return this._account;
  }

  static async load(
    connection: Connection,
    realmId: PublicKey,
    programId: PublicKey
  ): Promise<BasicRealm> {
    const realmAccount = await getRealm(connection, realmId);

    if (!arePubkeysEqual(realmAccount.owner, programId))
      throw new LibError(
        `programId: ${programId
          .toBase58()
          .slice(0, 6)}... does not own realmId: ${realmId
          .toBase58()
          .slice(0, 6)}...`
      );

    return new BasicRealm(programId, realmAccount);
  }
}
