import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Signer, Transaction } from "@solana/web3.js";

export async function sendWalletTransaction(
  connection: Connection,
  tx: Transaction,
  wallet: WalletContextState,
  signers?: Signer[]
) {
  if (!wallet.publicKey) throw new Error("Wallet is not initialized");

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");

  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = wallet.publicKey;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  tx = await wallet.signTransaction!(tx);
  if (signers && signers.length > 0) tx.partialSign(...signers);

  const txSig = await connection.sendRawTransaction(await tx.serialize());

  await connection.confirmTransaction({
    signature: txSig,
    blockhash,
    lastValidBlockHeight,
  });

  return txSig;
}
