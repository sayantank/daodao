import { BasicRealm } from "@lib";
import { createContext, useContext } from "react";

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

export const useRealmContext = () => {
  const context = useContext(RealmContext);

  if (!context)
    throw new Error("Make sure you wrap your component with RealmProvider");

  return context;
};
