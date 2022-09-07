import { RealmProvider } from "@contexts/RealmContext";
import { useRealm } from "@hooks/useRealm";
import Head from "next/head";
import { useRouter } from "next/router";

type RealmLayoutProps = {
  children: React.ReactNode;
};

const RealmLayout: React.FC<RealmLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { realm: realmQuery } = router.query;

  const { realm, error, isLoading } = useRealm(realmQuery as string);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>DAO.DAO</title>
      </Head>
      <RealmProvider realm={realm}>{children}</RealmProvider>
    </>
  );
};

export const getRealmLayout = (page: React.ReactNode) => (
  <RealmLayout>{page}</RealmLayout>
);
