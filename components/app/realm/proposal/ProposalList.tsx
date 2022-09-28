import { useRealmContext } from "@contexts/RealmContext";
import ProposalListItem from "./ProposalListItem";

export default function ProposalList() {
  const { realm } = useRealmContext();

  return (
    <div className="p-3 rounded-md bg-slate-800 w-full space-y-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-200">Proposals</h3>
      </div>
      <div className="space-y-3">
        {realm.proposals.map((p) => (
          <ProposalListItem key={p.pubkey.toBase58()} proposal={p} />
        ))}
      </div>
    </div>
  );
}
