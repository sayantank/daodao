import { SolanaCluster } from "@contexts/SolanaContext";
import { RealmMeta } from "@lib";

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
