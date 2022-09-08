import { useRouter } from "next/router";
import Head from "next/head";
import AppNav from "@components/common/AppNav";
import { RealmProvider } from "@contexts/RealmContext";
import { useRealm } from "@hooks/useRealm";

type RealmLayoutProps = {
  children: React.ReactNode;
};

function RealmLayout({ children }: RealmLayoutProps) {
  const router = useRouter();
  const { realm: realmQuery } = router.query;

  const { realm, error, isLoading } = useRealm(realmQuery as string);

  // TODO: Handle Loading state
  if (isLoading) return <div>Loading...</div>;

  // TODO: Handle Error stat, can redirect to 404 or home
  if (error) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>DAO.DAO</title>
      </Head>
      <RealmProvider realm={realm}>
        <div className="relative flex min-h-full flex-col">
          <AppNav />
          {children}
        </div>
      </RealmProvider>
    </>
  );
}

export const getRealmLayout = (page: React.ReactNode) => (
  <RealmLayout>{page}</RealmLayout>
);
