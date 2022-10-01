import { useRealmContext } from "@contexts/RealmContext";
import { useMemo } from "react";
import WalletAccordion from "./WalletAccordion";

export default function BasicTreasuryCard() {
  const { realm } = useRealmContext();

  const realmWallets = useMemo(() => {
    return realm.getRealmWallets();
  }, [realm]);

  return (
    <div className="bg-slate-800 p-3 rounded-lg space-y-2 divide divide-y divide-slate-700">
      <div>
        <h3 className="text-lg font-medium text-slate-300">Treasury</h3>
        <p className="text-3xl sm:text-4xl font-semibold text-slate-200">
          $2000
        </p>
      </div>
      <div>
        <div className="mt-2">
          <h4 className="text-sm text-slate-400">Wallets</h4>
          <div className="w-full space-y-2 mt-2">
            {Object.entries(realmWallets).map(([k, v]) => (
              <WalletAccordion key={k} wallet={v} name={k} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
