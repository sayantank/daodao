import AppNav from "@components/common/AppNav";
import { AppProvider } from "@contexts/AppContext";
import { useClusterRealms } from "@hooks/useClusterRealms";
import Head from "next/head";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { realms, isLoading, error } = useClusterRealms();

  if (isLoading) return <div>Loading...</div>;

  if (error || !realms) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>DAO.DAO</title>
      </Head>
      <AppProvider realms={realms}>
        <div className="relative flex min-h-full flex-col">
          <AppNav />
          <div className="mx-auto w-full max-w-7xl p-2 sm:p-4 lg:p-8 ">
            {children}
          </div>
        </div>
      </AppProvider>
    </>
  );
}

export const getAppLayout = (page: React.ReactNode) => (
  <AppLayout>{page}</AppLayout>
);
