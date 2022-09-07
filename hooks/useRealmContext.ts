import { RealmContext } from "@contexts/RealmContext";
import { useContext } from "react";

export const useRealmContext = () => {
  const context = useContext(RealmContext);

  if (!context)
    throw new Error("Make sure you wrap your component with RealmProvider");

  return context;
};
