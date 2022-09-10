import { SolanaCluster } from "@contexts/SolanaContext";
import { RealmMeta } from "@lib";

export enum LinkType {
  Address,
  Transaction,
}

export const getRealmUrlFromMeta = (
  realm: RealmMeta,
  cluster: SolanaCluster
) => {
  return `/app/${realm.symbol}${
    cluster.network !== "mainnet-beta" ? `?network=${cluster.network}` : ""
  }`;
};

export const isDevnet = (cluster: SolanaCluster) =>
  cluster.network === "devnet";

export const getExplorerLink = (
  type: LinkType,
  value: string,
  cluster: SolanaCluster
) => {
  const base = "https://explorer.solana.com";
  const clusterSuffix =
    cluster.network !== "mainnet-beta" ? `?cluster=${cluster.network}` : "";

  switch (type) {
    case LinkType.Address:
      return `${base}/address/${value}${clusterSuffix}`;
    case LinkType.Transaction:
      return `${base}/tx/${value}${clusterSuffix}`;
  }
};
