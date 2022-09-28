import {
  Governance,
  GovernanceAccountType,
  ProgramAccount,
  getNativeTreasuryAddress,
} from "@solana/spl-governance";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { NativeTreasury } from "../lib/types";
import { getMultipleAccountInfoChunked } from "./accounts";

export const getGovernancesByAccountTypes = (
  governancesArray: ProgramAccount<Governance>[],
  types: GovernanceAccountType[]
) => {
  const governancesFiltered = governancesArray.filter((gov) =>
    types.some((t) => gov.account?.accountType === t)
  );
  return governancesFiltered;
};

export const getNativeTreasuries = async (
  connection: Connection,
  governances: ProgramAccount<Governance>[],
  programId: PublicKey
) => {
  const nativeAddresses = await Promise.all(
    governances.map(
      async (g) => await getNativeTreasuryAddress(programId, g.pubkey)
    )
  );

  const nativeAccounts = await getMultipleAccountInfoChunked(
    connection,
    nativeAddresses
  );

  const nativeTreasuries: NativeTreasury[] = [];

  nativeAccounts.forEach((a, i) => {
    if (a)
      nativeTreasuries.push({
        address: nativeAddresses[i],
        lamports: new BN(a.lamports),
        governance: governances[i],
        programId,
      });
  });

  return nativeTreasuries;
};
