import { RealmProvider, useRealmContext } from "@contexts/RealmContext";
import { AppLayout } from "./AppLayout";

type RealmLayoutProps = {
  children: React.ReactNode;
};

function RealmLayout({ children }: RealmLayoutProps) {
  const { realm, isLoading, error } = useRealmContext();

  // TODO: Handle Loading state
  if (isLoading) return <div>Loadingohohoho...</div>;

  // TODO: Handle Error stat, can redirect to 404 or home
  if (error) return <div>{JSON.stringify(error)}</div>;

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
