import { useClusterRealms } from "@hooks/useClusterRealms";
import { RealmMeta } from "@lib";
import { createContext, useContext } from "react";

type AppContextType = {
  realms?: RealmMeta[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isLoading: boolean;
};

export const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  children: React.ReactNode;
  realms?: RealmMeta[];
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const { data: realms, isLoading, error } = useClusterRealms();

  return (
    <AppContext.Provider value={{ realms, error, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context)
    throw new Error("Make sure you wrap your component with AppProvider");

  return context;
};
