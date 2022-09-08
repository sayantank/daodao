import { BasicRealm } from "@lib";
import {
  getTokenOwnerRecord,
  getTokenOwnerRecordAddress,
} from "@solana/spl-governance";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
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
  realm: BasicRealm,
  tokenMint?: PublicKey,
  owner?: PublicKey | null
) => {
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
    fetchTokenOwnerRecord
  );

  return {
    tokenOwnerRecord,
    error,
    mutate,
    isValidating,
    isLoading: !tokenOwnerRecord && !error,
  };
};
