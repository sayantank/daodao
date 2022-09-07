import { BasicRealm } from "@lib";
import { createContext } from "react";

type RealmContextType = {
  realm: BasicRealm;
};

export const RealmContext = createContext<RealmContextType | null>(null);

type RealmProviderProps = {
  children: React.ReactNode;
  realm?: BasicRealm;
};

export const RealmProvider = ({ realm, children }: RealmProviderProps) => {
  if (!realm) throw new Error("Invalid realm provided to RealmProvider");

  return (
    <RealmContext.Provider value={{ realm }}>{children}</RealmContext.Provider>
  );
};
