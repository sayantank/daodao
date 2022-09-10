import {
  MintMaxVoteWeightSource,
  ProgramAccount,
  Realm,
  getRealm,
} from "@solana/spl-governance";
import { getMint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { arePubkeysEqual } from "@utils/pubkey";
import BN from "bn.js";
import { IRealm } from "lib/interfaces";
import { MintMeta } from "lib/types";
import { LibError } from "lib/errors";
import { getMintMeta } from "@utils/token";

export class BasicRealm implements IRealm {
  private _programId: PublicKey;
  private _account: ProgramAccount<Realm>;
  private _communityMintMeta: MintMeta;
  private _councilMintMeta: MintMeta | undefined;
  private _imageUrl?: string;

  constructor(
    programId: PublicKey,
    account: ProgramAccount<Realm>,
    communityMintMeta: MintMeta,
    councilMintMeta?: MintMeta,
    imageUrl?: string
  ) {
    this._programId = programId;
    this._account = account;
    this._communityMintMeta = communityMintMeta;
    this._councilMintMeta = councilMintMeta;
    this._imageUrl = imageUrl;
  }

  public get programId(): PublicKey {
    return this._programId;
  }

  public get account(): ProgramAccount<Realm> {
    return this._account;
  }

  public get communityMint(): MintMeta {
    return this._communityMintMeta;
  }

  public get councilMint(): MintMeta | undefined {
    return this._councilMintMeta;
  }

  public get authority(): PublicKey | undefined {
    return this._account.account.authority;
  }

  public get votingProposalCount(): number {
    return this._account.account.votingProposalCount;
  }

  public get communityMintMaxVoteWeightSource(): MintMaxVoteWeightSource {
    return this._account.account.config.communityMintMaxVoteWeightSource;
  }

  public get minVoteWeightToCreateGovernance(): BN {
    return this._account.account.config.minCommunityTokensToCreateGovernance;
  }

  public get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  public get name(): string {
    return this._account.account.name;
  }

  static async load(
    connection: Connection,
    realmId: PublicKey,
    programId: PublicKey,
    imageUrl?: string
  ): Promise<BasicRealm> {
    const realmAccount = await getRealm(connection, realmId);

    getMint;
    if (!arePubkeysEqual(realmAccount.owner, programId))
      throw new LibError(
        `programId: ${programId
          .toBase58()
          .slice(0, 6)}... does not own realmId: ${realmId
          .toBase58()
          .slice(0, 6)}...`
      );

    const communityMint = realmAccount.account.communityMint;
    const councilMint = realmAccount.account.config.councilMint;

    const communityMintMeta = await getMintMeta(connection, communityMint);
    const councilMintMeta = councilMint
      ? await getMintMeta(connection, councilMint)
      : undefined;

    return new BasicRealm(
      programId,
      realmAccount,
      communityMintMeta,
      councilMintMeta,
      imageUrl
    );
  }

  public async depositGoverningTokens(amount: BN): Promise<string> {
    return amount.toString();
  }
}
