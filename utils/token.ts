import { MintMeta } from "@lib";
import { Metaplex } from "@metaplex-foundation/js";
import { getMint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export const getMintMeta = async (
  connection: Connection,
  mint: PublicKey
): Promise<MintMeta> => {
  const mintInfo = await getMint(connection, mint, "confirmed");
  try {
    const metaplex = new Metaplex(connection);
    const communityTokenMetadata = await metaplex
      .nfts()
      .findByMint({
        mintAddress: mint,
        commitment: "confirmed",
        loadJsonMetadata: false,
      })
      .run();

    return {
      ...mintInfo,
      name: communityTokenMetadata.name,
      symbol: communityTokenMetadata.symbol,
    };
  } catch (err) {
    console.error("Failed to get token metadata: ", err);
    return { ...mintInfo };
  }
};
