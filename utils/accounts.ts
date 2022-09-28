import { ProgramAccount } from "@solana/spl-governance";
import {
  AccountInfo,
  Commitment,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { arrayToRecord, chunks } from "./helpers";

export function accountsToPubkeyMap<T>(accounts: ProgramAccount<T>[]) {
  return arrayToRecord(accounts, (a) => a.pubkey.toBase58());
}
export async function getMultipleAccountInfoChunked(
  connection: Connection,
  keys: PublicKey[],
  size = 99,
  commitment: Commitment | undefined = "recent"
): Promise<(AccountInfo<Buffer> | null)[]> {
  return (
    await Promise.all(
      chunks(keys, size).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk, commitment)
      )
    )
  ).flat();
}

export async function getParsedMultipleAccountInfoChunked<T>(
  connection: Connection,
  keys: PublicKey[],
  parser: (account: AccountInfo<Buffer> | null) => T,
  size = 99,
  commitment: Commitment | undefined = "recent"
): Promise<T[]> {
  const accounts = await getMultipleAccountInfoChunked(
    connection,
    keys,
    size,
    commitment
  );
  return accounts.map((account) => parser(account));
}
