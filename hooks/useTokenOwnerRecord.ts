import { BasicRealm } from "@lib";
import {
  ProgramAccount,
  TokenOwnerRecord,
  getTokenOwnerRecord,
  getTokenOwnerRecordAddress,
} from "@solana/spl-governance";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { SWRHookReturnType } from "@utils/types";
import { IRealm } from "lib/interfaces";
import useSWR from "swr";

const fetchTokenOwnerRecord = async (
  connection: Connection,
  realm: BasicRealm,
  tokenMint: PublicKey,
  owner: PublicKey
) => {
  const account = await getTokenOwnerRecordAddress(
    realm.programId,
    realm.account.pubkey,
    tokenMint,
    owner
  );
  return getTokenOwnerRecord(connection, account);
};

export const useTokenOwnerRecord = (
  realm: IRealm,
  tokenMint?: PublicKey | null,
  owner?: PublicKey | null
): SWRHookReturnType<ProgramAccount<TokenOwnerRecord>> => {
  const { connection } = useConnection();

  const {
    data: tokenOwnerRecord,
    error,
    mutate,
    isValidating,
  } = useSWR(
    () =>
      tokenMint &&
      owner && [connection, realm, tokenMint, owner, "token-owner-record"],
    fetchTokenOwnerRecord,
    { revalidateIfStale: false }
  );

  return {
    data: tokenOwnerRecord,
    error,
    mutate,
    isValidating,
    isLoading: !tokenOwnerRecord && !error,
  };
};
