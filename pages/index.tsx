import { ReactNode, useEffect } from "react";
import { getRegularLayout } from "@layouts/RegularLayout";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  return <div></div>;
};

Home.getLayout = (page: ReactNode) => getRegularLayout(page, "Home");

export default Home;
