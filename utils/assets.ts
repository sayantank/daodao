import {
  Governance,
  GovernanceAccountType,
  ProgramAccount,
  getNativeTreasuryAddress,
} from "@solana/spl-governance";
import { AccountLayout } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  AssetType,
  Assets,
  MintAssetType,
  ProgramAssetType,
  TokenAccountAssetType,
} from "../lib/interfaces/asset";
import { parseMintAccount, parseProgramAccount } from "../lib/parsers";
import { getParsedMultipleAccountInfoChunked } from "./accounts";
import { getGovernancesByAccountTypes } from "./governance";
import { arrayToRecord } from "./helpers";
import { fetchTokenAccounts } from "./token";

export const getAllAssets = async (
  connection: Connection,
  governances: ProgramAccount<Governance>[],
  programId: PublicKey
): Promise<Assets> => {
  const [mintAssets, programAssets, tokenAccountAssets] = await Promise.all([
    getMintAssets(connection, governances),
    getProgramAssets(connection, governances),
    getTokenAccountAssets(connection, governances, programId),
  ]);

  return {
    mintAssets,
    programAssets,
    tokenAccountAssets,
  };
};

export const getMintAssets = async (
  connection: Connection,
  governances: ProgramAccount<Governance>[]
): Promise<MintAssetType[]> => {
  const mintGovernances = getGovernancesByAccountTypes(governances, [
    GovernanceAccountType.MintGovernanceV1,
    GovernanceAccountType.MintGovernanceV2,
  ]);
  const rawMints = await getParsedMultipleAccountInfoChunked(
    connection,
    mintGovernances.map((g) => g.account.governedAccount),
    parseMintAccount
  );

  if (rawMints.length !== mintGovernances.length)
    throw new Error("Invalid mint parsing.");

  return mintGovernances.map((g, i) => {
    if (!rawMints[i]) throw new Error("Invalid mint parsing.");
    return {
      type: AssetType.Mint,
      address: g.account.governedAccount,
      governance: g,
      decimals: rawMints[i].decimals,
      mintAuthority: rawMints[i].mintAuthorityOption
        ? rawMints[i].mintAuthority
        : null,
    };
  });
};

export const getProgramAssets = async (
  connection: Connection,
  governances: ProgramAccount<Governance>[]
): Promise<ProgramAssetType[]> => {
  const programGovernances = getGovernancesByAccountTypes(governances, [
    GovernanceAccountType.ProgramGovernanceV1,
    GovernanceAccountType.ProgramGovernanceV2,
  ]);

  const programAccounts = await getParsedMultipleAccountInfoChunked(
    connection,
    programGovernances.map((g) => g.account.governedAccount),
    parseProgramAccount
  );

  if (programAccounts.length !== programGovernances.length)
    throw new Error("Invalid program parsing.");

  return programGovernances.map((g, i) => {
    if (!programAccounts[i]) throw new Error("Invalid program parsing.");
    return {
      type: AssetType.Program,
      address: g.account.governedAccount,
      governance: g,
    };
  });
};

export const getTokenAccountAssets = async (
  connection: Connection,
  governances: ProgramAccount<Governance>[],
  programId: PublicKey
): Promise<TokenAccountAssetType[]> => {
  const governanceAddresses = arrayToRecord(
    governances.map((g) => ({ address: g.pubkey, governance: g })),
    (g) => g.address.toBase58()
  );
  const nativeTreasuryAddresses = arrayToRecord(
    await Promise.all(
      governances.map(async (g) => {
        const address = await getNativeTreasuryAddress(programId, g.pubkey);
        return {
          address,
          governance: g,
        };
      })
    ),
    (i) => i.address.toBase58()
  );

  // Fetching token accounts owned by both Governance PDA and Native Treasury PDA
  const rawTokenAccounts = (await Promise.all([
    fetchTokenAccounts(
      connection,
      Object.entries(governanceAddresses).map(([, gov]) =>
        gov.address.toBase58()
      )
    ),
    fetchTokenAccounts(
      connection,
      Object.entries(nativeTreasuryAddresses).map(([, native]) =>
        native.address.toBase58()
      )
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]).then(([g, n]) => g.data.concat(n.data))) as any[];

  const tokenAccountAssets = [...rawTokenAccounts.flatMap((x) => x.result)].map(
    (x) => {
      const publicKey = new PublicKey(x.pubkey);
      const data = Buffer.from(x.account.data[0], "base64");
      const account = AccountLayout.decode(data);

      const governance = nativeTreasuryAddresses[account.owner.toBase58()]
        ? nativeTreasuryAddresses[account.owner.toBase58()].governance
        : governanceAddresses[account.owner.toBase58()]
        ? governanceAddresses[account.owner.toBase58()].governance
        : null;

      if (!governance) {
        throw new Error("Governance not found for token account.");
      }

      return {
        type: AssetType.TokenAccount,
        address: publicKey,
        governance,
        owner: account.owner,
        balance: new BN(account.amount.toString()),
        mint: account.mint,
      };
    }
  );

  return tokenAccountAssets;
};
