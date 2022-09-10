import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { BasicRealm } from "@lib";
import { useAppContext } from "@contexts/AppContext";
import { IRealm } from "lib/interfaces";
import { SWRHookReturnType } from "@utils/types";

const fetchRealm = async (
  connection: Connection,
  realmId: PublicKey,
  programId: PublicKey
): Promise<IRealm> => {
  return BasicRealm.load(connection, realmId, programId);
};

/**
 * @param realmQuery A symbol or pubkey representing the realm to be used.
 */
export const useRealm = (realmQuery: string): SWRHookReturnType<IRealm> => {
  const { connection } = useConnection();
  const { realms } = useAppContext();

  const [programId, setProgramId] = useState<PublicKey | null>(null);
  const [realmId, setRealmId] = useState<PublicKey | null>(null);

  const {
    data: realm,
    error,
    mutate,
    isValidating,
  } = useSWR(
    () => realmId && [connection, realmId, programId, "realm"],
    fetchRealm
  );

  // https://stackoverflow.com/questions/61751728/asynchronous-calls-with-react-usememo
  useEffect(() => {
    let active = true;
    loadIds();
    return () => {
      active = false;
    };

    async function loadIds() {
      if (realms) {
        // Finding realm from db
        const realm = realms.find(
          (realm) =>
            realm.symbol === realmQuery ||
            realm.realmId.toBase58() === realmQuery
        );

        if (!realm) {
          // If realm not found, try to parse realmQuery as a pubkey and set account owner as programId
          try {
            const id = new PublicKey(realmQuery);
            const account = await connection.getAccountInfo(id, "confirmed");

            if (!active) return;

            if (active) {
              if (account) {
                setRealmId(id);
                setProgramId(account.owner);
              } else {
                setRealmId(null);
                setProgramId(null);
              }
            }
          } catch (e) {
            if (active) {
              setRealmId(null);
              setProgramId(null);
            }
          }
        }
        // If realm found, set realmId
        else {
          setRealmId(realm.realmId);
          setProgramId(realm.programId);
        }
      }
    }
  }, [connection, realmQuery, realms]);

  return {
    data: realm,
    isLoading: !error && !realm,
    error,
    mutate,
    isValidating,
  };
};
