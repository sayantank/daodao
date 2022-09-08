import { ReactNode } from "react";
import { getAppLayout } from "@layouts/AppLayout";
import Link from "next/link";
import { useAppContext } from "@contexts/AppContext";
import { getRealmUrlFromMeta } from "@utils/url";
import { useSolana } from "@contexts/SolanaContext";

export default function App() {
  const { cluster } = useSolana();
  const { realms } = useAppContext();

  return (
    <div>
      {realms && realms.length > 0 ? (
        realms.map((realm) => (
          <Link key={realm.name} href={getRealmUrlFromMeta(realm, cluster)}>
            <a>
              <div className="block text-white">{realm.name}</div>
            </a>
          </Link>
        ))
      ) : (
        <div>No realms found</div>
      )}
    </div>
  );
}

App.getLayout = (page: ReactNode) => getAppLayout(page);
