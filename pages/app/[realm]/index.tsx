import { ReactNode, useEffect } from "react";
import RealmHeader from "@components/app/realm/RealmHeader";
import ProposalList from "@components/app/realm/proposal/ProposalList";
import { useRealmContext } from "@contexts/RealmContext";
import { getAppLayout } from "@layouts/AppLayout";
import { BasicRealm } from "@lib";

export default function RealmScreen() {
  const { realm, isLoading, error } = useRealmContext();

  // useEffect(() => {
  //   console.log(realm.testProp);
  // }, [realm]);

  useEffect(() => {
    console.log(realm instanceof BasicRealm);
  }, [realm]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!realm) return null;

  return (
    <div>
      <RealmHeader />
      <div className="my-4 flex flex-col-reverse lg:flex-row lg:space-x-4 space-y-4 space-y-reverse lg:space-y-0 items-start">
        <div className="flex-1 w-full">
          <ProposalList />
        </div>
        <div className="w-full lg:max-w-sm flex flex-col space-y-4">
          <div>
            <realm.VoterInfo />
          </div>
          <div>
            <realm.TreasurySummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getAppLayout(page);
