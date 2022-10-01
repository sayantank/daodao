import AppNav from "@components/common/AppNav";
import { useAppContext } from "@contexts/AppContext";
import Head from "next/head";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { realms, error, isLoading } = useAppContext();

  if (isLoading) return <div>Loading...</div>;

  if (error || !realms) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>DAO.DAO</title>
      </Head>
      <div className="relative flex min-h-full flex-col">
        <AppNav />
        <div className="mx-auto w-full max-w-7xl p-2 sm:p-4 lg:p-8 ">
          {children}
        </div>
      </div>
    </>
  );
}

export const getAppLayout = (page: React.ReactNode) => (
  <AppLayout>{page}</AppLayout>
);
