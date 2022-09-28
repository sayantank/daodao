import { Mint, getMint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { SWRHookReturnType } from "@utils/types";
import useSWR from "swr";

const fetchMint = (connection: Connection, mint: PublicKey) => {
  return getMint(connection, mint);
};

export const useMint = (mint?: PublicKey): SWRHookReturnType<Mint> => {
  const { connection } = useConnection();

  const { data, error, mutate, isValidating } = useSWR(
    () => mint && [connection, mint, "mint"],
    fetchMint,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading: !data && !error,
  };
};
