import { useRealmContext } from "@hooks/useRealmContext";
import { getRealmLayout } from "@layouts/RealmLayout";
import { ReactNode } from "react";

export default function RealmScreen() {
  const { realm } = useRealmContext();
  return (
    <div>
      <div>realm</div>
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getRealmLayout(page);
