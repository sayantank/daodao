import { getAppLayout } from "@layouts/AppLayout";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function CreateProposal() {
  const router = useRouter();

  //   const { realm } = useRealmContext();

  return <button onClick={() => router.back()}>bacl</button>;
}

CreateProposal.getLayout = (page: ReactNode) => getAppLayout(page);
