import { getRegularLayout } from "@layouts/RegularLayout";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function RealmScreen() {
  const router = useRouter();
  const { realm } = router.query;

  return <div>{realm}</div>;
}

RealmScreen.getLayout = (page: ReactNode) => getRegularLayout(page, "Realm");
