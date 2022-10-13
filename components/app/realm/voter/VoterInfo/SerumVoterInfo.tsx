import { useRealmContext } from "@contexts/RealmContext";
import BasicVoterInfo from "./BasicVoterInfo";

export default function SerumVoterInfo() {
  const { realm } = useRealmContext();

  return (
    <>
      <BasicVoterInfo />
      <div className="mt-4 p-1 bg-slate-800 rounded-md">serum voter info</div>
    </>
  );
}
