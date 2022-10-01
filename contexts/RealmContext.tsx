import { useRealm } from "@hooks/useRealm";
import { IRealm } from "lib/interfaces";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";

type RealmContextType = {
  realm?: IRealm;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isLoading: boolean;
};

export const RealmContext = createContext<RealmContextType | null>(null);

type RealmProviderProps = {
  children: React.ReactNode;
  realm?: IRealm;
};

export const RealmProvider = ({ children }: RealmProviderProps) => {
  const router = useRouter();
  const { realm: realmQuery } = router.query;

  const { data: realm, error, isLoading } = useRealm(realmQuery as string);

  useEffect(() => {
    console.log(realmQuery);
  }, [realmQuery]);

  // if (!realm) throw new Error("Invalid realm provided to RealmProvider");

  return (
    <RealmContext.Provider value={{ realm, error, isLoading }}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealmContext = () => {
  const context = useContext(RealmContext);

  if (!context)
    throw new Error("Make sure you wrap your component with RealmProvider");

  return context;
};
