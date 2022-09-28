import { MintMeta } from "@lib";
import { Metaplex } from "@metaplex-foundation/js";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import BN from "bn.js";
import { TOKEN_ACCOUNT_LAYOUT } from "./layouts";

const tokenAccountOwnerOffset = 32;

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

// https://github.com/indutny/bn.js/issues/209
export function toPlainString(num: string) {
  return `${num}`.replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/, (a, b, c, d, e) =>
    e < 0
      ? `${b}0.${Array(1 - e - c.length).join("0")}${c}${d}`
      : b + c + d + Array(e - d.length + 1).join("0")
  );
}

// TODO: Do not export until Intl NumberFormat is supported
function tokenAtomicsToDecimalString(
  tokenAtomics: BN,
  decimals: number
): string {
  const s = tokenAtomics.toString().padStart(decimals + 1, "0");
  const decIndex = s.length - decimals;
  return `${s.substring(0, decIndex)}.${s.substring(decIndex)}`;
}

export function tokenAtomicsToDecimal(
  tokenAtomics: BN,
  decimals: number
): number {
  return Number(tokenAtomicsToDecimalString(tokenAtomics, decimals));
}

// TODO: Do not export until Intl NumberFormat is supported
function tokenDecimalStringToAtomics(
  tokenDecimalString: string,
  decimals: number
): BN {
  const [integer, fractional = ""] = tokenDecimalString.split(".");
  return new BN(`${integer}${"0".repeat(decimals)}`).add(
    new BN(fractional.padEnd(decimals, "0"))
  );
}

export function tokenDecimalsToAtomics(
  tokenDecimals: number,
  decimals: number
): BN {
  return tokenDecimalStringToAtomics(
    toPlainString(tokenDecimals.toString()),
    decimals
  );
}

function roundDown(num: number, decimalPlaces: number): number {
  return Math.floor(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function prettifyDecimal(num: number, decimalPlaces: number): string {
  if (num === 0) {
    return decimalPlaces === 0 ? "0" : `0.${"0".repeat(decimalPlaces)}`;
  }

  if (num < 0.01) return "<0.01";

  if (num >= 1e9) return `${roundDown(num / 1e9, decimalPlaces)}B`;

  if (num >= 1e6) return `${roundDown(num / 1e6, decimalPlaces)}M`;

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  return `${roundDown(num, decimalPlaces)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function tokenAtomicsToPrettyDecimal(
  tokenAtomics: BN,
  decimals: number,
  displayDecimals?: number
) {
  const decimalNum = tokenAtomicsToDecimal(tokenAtomics, decimals);
  return prettifyDecimal(decimalNum, displayDecimals || 2);
}

// From https://stackoverflow.com/a/58136480/5060334
/**
 * Format number with thousands and decimal separator
 * @param num
 * @param thousand
 * @param decimal
 * @param universal
 */
export function formatNumber(
  num: number | string,
  thousand = ",",
  decimal = ".",
  universal = "\\d"
) {
  const number =
    decimal === "." ? num.toString() : num.toString().replace(".", decimal);

  return number.replace(
    RegExp(
      `\\${
        decimal || "."
      }${universal}+|${universal}(?=(?:${universal}{3})+(?!${universal}))`,
      "g"
    ),
    (a) => (a.length === 1 ? a + thousand : a)
  );
}

export function divideBN(numerator: BN, denominator: BN): number {
  const num = numerator.toNumber();
  const den = denominator.toNumber();

  return num / den;
}

export const fetchTokenAccounts = (
  connection: Connection,
  addresses: string[]
) =>
  axios.request({
    url: connection.rpcEndpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(
      addresses.map((address) => ({
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
          TOKEN_PROGRAM_ID.toBase58(),
          {
            commitment: connection.commitment,
            encoding: "base64",
            filters: [
              {
                dataSize: TOKEN_ACCOUNT_LAYOUT.span, // number of bytes
              },
              {
                memcmp: {
                  offset: tokenAccountOwnerOffset, // number of bytes
                  bytes: address, // base58 encoded string
                },
              },
            ],
          },
        ],
      }))
    ),
  });
