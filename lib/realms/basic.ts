/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Governance,
  MintMaxVoteWeightSource,
  ProgramAccount,
  Proposal,
  Realm,
  getGovernanceAccounts,
  getGovernanceProgramVersion,
  getRealm,
  pubkeyFilter,
  withDepositGoverningTokens,
} from "@solana/spl-governance";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { arePubkeysEqual } from "@utils/pubkey";
import { getMintMeta } from "@utils/token";
import { LibError } from "lib/errors";
import { Assets } from "lib/interfaces/asset";
import { IRealm } from "lib/interfaces/realm";
import { InstructionSet, MintMeta, NativeTreasury } from "lib/types";
import { compareProposals } from "@utils/proposal";
import { accountsToPubkeyMap } from "@utils/accounts";
import { getAllAssets } from "@utils/assets";
import { getNativeTreasuries } from "@utils/governance";

export class BasicRealm implements IRealm {
  public readonly id = "basic";

  private _programId: PublicKey;
  private _programVersion: number;
  private _account: ProgramAccount<Realm>;
  private _communityMintMeta: MintMeta;
  private _councilMintMeta: MintMeta | undefined;
  private _imageUrl?: string;

  private _governances: ProgramAccount<Governance>[] = [];
  private _proposals: ProgramAccount<Proposal>[] = [];
  private _nativeTreasuries: NativeTreasury[] = [];
  private _assets: Assets;

  constructor(
    programId: PublicKey,
    programVersion: number,
    account: ProgramAccount<Realm>,
    communityMintMeta: MintMeta,
    governances: ProgramAccount<Governance>[],
    proposals: ProgramAccount<Proposal>[],
    nativeTreasuries: NativeTreasury[],
    assets: Assets,
    councilMintMeta?: MintMeta,
    imageUrl?: string
  ) {
    this._programId = programId;
    this._programVersion = programVersion;
    this._account = account;
    this._communityMintMeta = communityMintMeta;
    this._councilMintMeta = councilMintMeta;
    this._imageUrl = imageUrl;
    this._governances = governances;
    this._proposals = proposals;
    this._nativeTreasuries = nativeTreasuries;
    this._assets = assets;
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

  public get programVersion(): number {
    return this._programVersion;
  }

  public get governances(): ProgramAccount<Governance>[] {
    return this._governances;
  }

  public get proposals(): ProgramAccount<Proposal>[] {
    return this._proposals;
  }

  public get nativeTreasuries(): NativeTreasury[] {
    return this._nativeTreasuries;
  }

  public get assets(): Assets {
    return this._assets;
  }

  static async load(
    connection: Connection,
    realmId: PublicKey,
    programId: PublicKey,
    imageUrl?: string
  ): Promise<BasicRealm> {
    const realmAccount = await getRealm(connection, realmId);
    const programVersion = await getGovernanceProgramVersion(
      connection,
      programId
    );

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

    // Get mint metas
    const communityMintMeta = await getMintMeta(connection, communityMint);
    const councilMintMeta = councilMint
      ? await getMintMeta(connection, councilMint)
      : undefined;

    // get governances
    const governances = await getGovernanceAccounts(
      connection,
      new PublicKey(programId),
      Governance,
      [pubkeyFilter(1, realmId)!]
    );

    // get proposals
    const proposalsByGovernance = await Promise.all(
      governances.map((g) =>
        getGovernanceAccounts(connection, new PublicKey(programId), Proposal, [
          pubkeyFilter(1, g.pubkey)!,
        ])
      )
    );
    // sort proposals rightaway
    const proposals = proposalsByGovernance.flatMap((p) => p);
    proposals.sort((a, b) =>
      compareProposals(a.account, b.account, accountsToPubkeyMap(governances))
    );

    // get assets
    const assets = await getAllAssets(connection, governances, programId);

    // get native treasuries
    const nativeTreasuries = await getNativeTreasuries(
      connection,
      governances,
      programId
    );

    return new BasicRealm(
      programId,
      programVersion,
      realmAccount,
      communityMintMeta,
      governances,
      proposals,
      nativeTreasuries,
      assets,
      councilMintMeta,
      imageUrl
    );
  }

  //TODO: implement
  public canCreateProposal(
    owner: PublicKey,
    governance?: ProgramAccount<Governance>
  ): boolean {
    if (!governance) return false;
    return true;
  }

  public async getDepositCommunityTokenInstructions(
    connection: Connection,
    amount: BN,
    owner: PublicKey
  ): Promise<InstructionSet> {
    const instructions: TransactionInstruction[] = [];
    const preInstructions: TransactionInstruction[] = [];
    const postInstructions: TransactionInstruction[] = [];

    const ataAddress = await getAssociatedTokenAddressSync(
      this.communityMint.address,
      owner,
      true
    );
    try {
      await connection.getTokenAccountBalance(ataAddress);
    } catch (e) {
      console.error("ATA not found. Adding create instruction");
      // Create ATA
      preInstructions.push(
        await createAssociatedTokenAccountInstruction(
          owner,
          ataAddress,
          owner,
          this._communityMintMeta.address
        )
      );
    }

    await withDepositGoverningTokens(
      instructions,
      this.programId,
      this.programVersion,
      this.account.pubkey,
      ataAddress,
      this.communityMint.address,
      owner,
      owner,
      owner,
      amount
    );

    return {
      instructions,
      preInstructions,
      postInstructions,
    };
  }
}
