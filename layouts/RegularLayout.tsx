import Head from "next/head";
import { FC, ReactNode } from "react";

type SiteLayoutProps = {
  title?: string;
  children: ReactNode;
};

export const RegularLayout: FC<SiteLayoutProps> = ({
  title,
  children,
}: SiteLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} - DAO.DAO` : `DAO.DAO`}</title>
      </Head>
      <div className="w-full h-screen overflow-y-auto flex flex-col space-y-4 justify-between">
        {children}
      </div>
    </>
  );
};
export const getRegularLayout = (page: React.ReactNode, title?: string) => (
  <RegularLayout title={title}>{page}</RegularLayout>
);
