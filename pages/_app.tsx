import { NextPage } from "next";
import { AppProps } from "next/app";
import { FC } from "react";
import { SolanaProvider } from "@contexts/SolanaContext";
import { RealmProvider } from "@contexts/RealmContext";
import { AppProvider } from "@contexts/AppContext";

// Use require instead of import since order matters
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: FC<AppPropsWithLayout> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SolanaProvider>
      <AppProvider>
        <RealmProvider>{getLayout(<Component {...pageProps} />)}</RealmProvider>
      </AppProvider>
    </SolanaProvider>
  );
};

export default App;
