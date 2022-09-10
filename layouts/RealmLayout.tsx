import { useRouter } from "next/router";
import { RealmProvider } from "@contexts/RealmContext";
import { useRealm } from "@hooks/useRealm";
import { AppLayout } from "./AppLayout";

type RealmLayoutProps = {
  children: React.ReactNode;
};

function RealmLayout({ children }: RealmLayoutProps) {
  const router = useRouter();
  const { realm: realmQuery } = router.query;

  const { data: realm, error, isLoading } = useRealm(realmQuery as string);

  // TODO: Handle Loading state
  if (isLoading) return <div>Loading...</div>;

  // TODO: Handle Error stat, can redirect to 404 or home
  if (error) return <div>Error</div>;

  return (
    <>
      <RealmProvider realm={realm}>{children}</RealmProvider>
    </>
  );
}

export const getRealmLayout = (page: React.ReactNode) => (
  <AppLayout>
    <RealmLayout>{page}</RealmLayout>
  </AppLayout>
);
