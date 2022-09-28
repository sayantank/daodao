import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, TokenAmount } from "@solana/web3.js";
import { SWRHookReturnType } from "@utils/types";
import useSWR from "swr";

const fetchBalance = async (
  connection: Connection,
  owner: PublicKey,
  tokenMint: PublicKey
) => {
  const ata = await getAssociatedTokenAddressSync(tokenMint, owner, true);
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
    () => owner && tokenMint && [connection, owner, tokenMint, "balance"],
    fetchBalance,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
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
