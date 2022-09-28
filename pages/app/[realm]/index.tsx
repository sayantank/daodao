import { getRealmLayout } from "@layouts/RealmLayout";
import { ReactNode, useEffect } from "react";
import RealmHeader from "@components/app/realm/RealmHeader";
import VoterInfo from "@components/app/realm/VoterInfo";
import { useRealmContext } from "@contexts/RealmContext";

export default function RealmScreen() {
  const { realm } = useRealmContext();

  useEffect(() => {
    console.log(realm.assets);
  }, [realm]);

  return (
    <div>
      <RealmHeader />
      <div className="my-4 flex flex-col-reverse lg:flex-row lg:space-x-4 space-y-4 space-y-reverse lg:space-y-0 items-start">
        <div className="flex-1 bg-red-200"></div>
        <div className="w-full lg:max-w-sm flex flex-col space-y-4">
          <div>
            <VoterInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getRealmLayout(page);
