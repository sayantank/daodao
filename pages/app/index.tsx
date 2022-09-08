import { ReactNode } from "react";
import { getAppLayout } from "@layouts/AppLayout";
import Link from "next/link";
import { useAppContext } from "@contexts/AppContext";
import { getRealmUrlFromMeta } from "@utils/url";
import { useSolana } from "@contexts/SolanaContext";
import RealmGridCard from "@components/app/RealmGridCard";

export default function App() {
  const { cluster } = useSolana();
  const { realms } = useAppContext();

  return (
    <div className="space-y-4">
      <div className="relative flex items-center justify-between">
        <h2 className="text-xl lg:text-3xl text-slate-300">Realms</h2>
        <button>Create DAO</button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {realms && realms.length > 0 ? (
          realms.map((realm) => (
            <Link
              key={realm.name}
              href={getRealmUrlFromMeta(realm, cluster)}
              passHref
            >
              <a>
                <RealmGridCard realm={realm} />
              </a>
            </Link>
          ))
        ) : (
          <div>No realms found</div>
        )}
      </div>
    </div>
  );
}

App.getLayout = (page: ReactNode) => getAppLayout(page);
