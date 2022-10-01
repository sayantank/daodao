import { Mint, getMint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { SWRHookReturnType } from "@utils/types";
import useSWR from "swr";

const fetchMint = (rpcEndpoint: string, mint: string) => {
  const connection = new Connection(rpcEndpoint);
  const mintPubkey = new PublicKey(mint);

  return getMint(connection, mintPubkey);
};

export const useMint = (mint?: PublicKey): SWRHookReturnType<Mint> => {
  const { connection } = useConnection();

  const { data, error, mutate, isValidating } = useSWR(
    () => mint && [connection.rpcEndpoint, mint.toBase58(), "mint"],
    fetchMint,
    {
      revalidateOnFocus: false,
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
