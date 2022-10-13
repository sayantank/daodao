/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Governance,
  Proposal,
  getGovernanceAccounts,
  getGovernanceProgramVersion,
  getRealm,
  pubkeyFilter,
} from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";
import { accountsToPubkeyMap } from "@utils/accounts";
import { getAllAssets } from "@utils/assets";
import { getNativeTreasuries } from "@utils/governance";
import { compareProposals } from "@utils/proposal";
import { arePubkeysEqual } from "@utils/pubkey";
import { getMintMeta } from "@utils/token";
import { LibError } from "./errors";

export const getRealmProperties = async (
  connection: Connection,
  realmId: PublicKey,
  programId: PublicKey,
  imageUrl?: string
) => {
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

  return {
    programVersion,
    realmAccount,
    communityMintMeta,
    governances,
    proposals,
    nativeTreasuries,
    assets,
    councilMintMeta,
    imageUrl,
  };
};
