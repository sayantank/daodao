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
  rpcEndpoint: string,
  realm: string,
  programId: string,
  tokenMint: string,
  owner: string
) => {
  const connection = new Connection(rpcEndpoint);
  const realmPubkey = new PublicKey(realm);
  const programPubkey = new PublicKey(programId);
  const tokenMintPubkey = new PublicKey(tokenMint);
  const ownerPubkey = new PublicKey(owner);

  const account = await getTokenOwnerRecordAddress(
    programPubkey,
    realmPubkey,
    tokenMintPubkey,
    ownerPubkey
  );
  return getTokenOwnerRecord(connection, account);
};

export const useTokenOwnerRecord = (
  realm?: IRealm,
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
      realm &&
      tokenMint &&
      owner && [
        connection.rpcEndpoint,
        realm.address.toBase58(),
        realm.programId.toBase58(),
        tokenMint.toBase58(),
        owner.toBase58(),
        "token-owner-record",
      ],
    fetchTokenOwnerRecord
  );

  return {
    data: tokenOwnerRecord,
    error,
    mutate,
    isValidating,
    isLoading: !tokenOwnerRecord && !error,
  };
};
