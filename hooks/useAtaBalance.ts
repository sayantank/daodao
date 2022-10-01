import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, TokenAmount } from "@solana/web3.js";
import { SWRHookReturnType } from "@utils/types";
import useSWR from "swr";

const fetchBalance = async (
  rpcEndpoint: string,
  owner: string,
  tokenMint: string
) => {
  const connection = new Connection(rpcEndpoint);
  const ownerPubkey = new PublicKey(owner);
  const tokenMintPubkey = new PublicKey(tokenMint);

  const ata = await getAssociatedTokenAddressSync(
    tokenMintPubkey,
    ownerPubkey,
    true
  );
  const response = await connection.getTokenAccountBalance(ata, "confirmed");
  return response.value;
};

export const useAtaBalance = (
  owner?: PublicKey | null,
  tokenMint?: PublicKey | null
): SWRHookReturnType<TokenAmount> => {
  const { connection } = useConnection();

  const {
    data: balance,
    error,
    mutate,
    isValidating,
  } = useSWR(
    () =>
      owner &&
      tokenMint && [
        connection.rpcEndpoint,
        owner.toBase58(),
        tokenMint.toBase58(),
        "balance",
      ],
    fetchBalance,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: balance,
    error,
    mutate,
    isValidating,
    isLoading: !balance && !error,
  };
};
