import { useRealmContext } from "@contexts/RealmContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ProposalListItem from "./ProposalListItem";

export default function ProposalList() {
  const router = useRouter();
  const { realm } = useRealmContext();

  if (!realm) return null;

  return (
    <div className="p-3 rounded-md bg-slate-800 w-full space-y-4">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-200">Proposals</h3>
        <button
          type="button"
          onClick={() =>
            router.push(
              `/app/${router.query.realm}/proposal/create${
                router.query.network ? `?network=${router.query.network}` : ""
              }`
            )
          }
          className="inline-flex items-center rounded border border-transparent bg-slate-700 px-2.5 py-1.5 text-sm font-medium transition-colors text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
          Create
        </button>
      </div>
      <div className="space-y-3">
        {realm.proposals.map((p) => (
          <ProposalListItem key={p.pubkey.toBase58()} proposal={p} />
        ))}
      </div>
    </div>
  );
}
