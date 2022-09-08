import { RealmMeta } from "@lib";
import { createContext, useContext } from "react";

type AppContextType = {
  realms: RealmMeta[];
};

export const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  children: React.ReactNode;
  realms?: RealmMeta[];
};

export const AppProvider = ({ children, realms }: AppProviderProps) => {
  if (!realms) throw new Error("Invalid realms provided to AppProvider");

  return (
    <AppContext.Provider value={{ realms }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context)
    throw new Error("Make sure you wrap your component with AppProvider");

  return context;
};
