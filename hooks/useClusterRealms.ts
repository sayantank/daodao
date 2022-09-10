import { SolanaCluster, useSolana } from "@contexts/SolanaContext";
import { RealmMeta } from "@lib";
import { SWRHookReturnType } from "@utils/types";
import { getDevnetRealms, getMainnetRealms } from "db/realms";
import useSWR from "swr";

const fetcher = async (cluster: SolanaCluster) => {
  switch (cluster.network) {
    case "mainnet-beta":
      return getMainnetRealms();
    case "devnet":
      return getDevnetRealms();
    default:
      throw new Error("Cluster not supported.");
  }
};

export const useClusterRealms = (): SWRHookReturnType<RealmMeta[]> => {
  const { cluster } = useSolana();

  const { data, error, mutate, isValidating } = useSWR(
    () => [cluster, "realms"],
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
    isValidating,
  };
};
