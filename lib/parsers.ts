import { MintLayout, RawMint } from "@solana/spl-token";
import { AccountInfo } from "@solana/web3.js";

export function parseMintAccount(account: AccountInfo<Buffer> | null): RawMint {
  if (!account) throw new Error("Mint account is null");

  return MintLayout.decode(account.data);
}

export function parseProgramAccount(
  account: AccountInfo<Buffer> | null
): AccountInfo<Buffer> {
  if (!account) throw new Error("Program account is null");

  if (!account.executable) throw new Error("Account is not executable");

  return account;
}

export function parseNativeAccount(
  account: AccountInfo<Buffer> | null
): AccountInfo<Buffer> {
  if (!account) throw new Error("Native account is null");

  return account;
}
