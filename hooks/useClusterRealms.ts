import { SolanaCluster } from "@contexts/SolanaContext";
import { getMainnetRealms } from "db/mainnet";
import useSWR from "swr";
import { useSolana } from "./useSolana";

const fetcher = async (cluster: SolanaCluster) => {
  switch (cluster.network) {
    case "mainnet-beta":
      return getMainnetRealms();
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
