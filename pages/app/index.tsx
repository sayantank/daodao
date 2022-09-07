import { ReactNode } from "react";
import { getRegularLayout } from "@layouts/RegularLayout";
import { useClusterRealms } from "@hooks/useClusterRealms";

export default function App() {
  const { realms, isLoading, error } = useClusterRealms();

  if (isLoading) return <div>Loading...</div>;

  if (error || !realms) return <div>Error</div>;

  return (
    <div>
      {realms && realms.length > 0 ? (
        realms.map((realm) => <div key={realm.name}>{realm.name}</div>)
      ) : (
        <div>No realms found</div>
      )}
    </div>
  );
}

App.getLayout = (page: ReactNode) => getRegularLayout(page);
