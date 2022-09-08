import { SolanaCluster, useSolana } from "@contexts/SolanaContext";
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

export const useClusterRealms = () => {
  const { cluster } = useSolana();

  const { data, error, mutate, isValidating } = useSWR(
    () => [cluster, "realms"],
    fetcher
  );

  return {
    realms: data,
    isLoading: !error && !data,
    error,
    mutate,
    isValidating,
  };
};
