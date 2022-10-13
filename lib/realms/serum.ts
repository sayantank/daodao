/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BasicTreasurySummaryCard from "@components/app/realm/treasury/TreasurySummaryCard/BasicTreasurySummaryCard";
import SerumVoterInfo from "@components/app/realm/voter/VoterInfo/SerumVoterInfo";
import {
  Governance,
  ProgramAccount,
  Proposal,
  Realm,
} from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";
import { getRealmProperties } from "lib/helpers";
import { Assets } from "lib/interfaces";
import { MintMeta, NativeTreasury } from "lib/types";
import { BasicRealm } from "./basic";

export class SerumRealm extends BasicRealm {
  //   readonly id = "serum";
  readonly TreasurySummaryCard = BasicTreasurySummaryCard;
  readonly VoterInfo = SerumVoterInfo;

  readonly testMember: string = "serum realm";

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
    super(
      programId,
      programVersion,
      account,
      communityMintMeta,
      governances,
      proposals,
      nativeTreasuries,
      assets,
      councilMintMeta,
      imageUrl
    );
  }

  static async load(
    connection: Connection,
    realmId: PublicKey,
    programId: PublicKey,
    imageUrl?: string
  ) {
    const {
      programVersion,
      realmAccount,
      communityMintMeta,
      councilMintMeta,
      governances,
      proposals,
      nativeTreasuries,
      assets,
    } = await getRealmProperties(connection, realmId, programId, imageUrl);

    return new SerumRealm(
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
}
