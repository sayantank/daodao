import mainnetRealms from "../public/realms/mainnet.json";
import { PublicKey } from "@solana/web3.js";
import { RealmMeta } from "@lib";

export function getMainnetRealms() {
  const realms: RealmMeta[] = [];

  mainnetRealms.forEach((r) => {
    try {
      const realm: RealmMeta = {
        symbol: r.symbol,
        name: r.name,
        programId: new PublicKey(r.programId),
        realmId: new PublicKey(r.realmId),
        website: r.website,
        ogImage: r.ogImage,
      };
      realms.push(realm);
    } catch (e) {
      console.error("Failed to parse realm", r);
    }
  });

  return realms;
}
