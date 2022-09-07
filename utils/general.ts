import { PublicKey } from "@solana/web3.js";

export function tryParseKey(key: string): PublicKey | undefined {
  try {
    return new PublicKey(key);
  } catch (error) {
    return undefined;
  }
}

export function arePubkeysEqual(a: PublicKey, b: PublicKey): boolean {
  return a.toBase58() === b.toBase58();
}