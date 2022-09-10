import { getRealmLayout } from "@layouts/RealmLayout";
import { ReactNode } from "react";
import RealmHeader from "@components/app/realm/RealmHeader";

export default function RealmScreen() {
  return (
    <div>
      <RealmHeader />
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getRealmLayout(page);
