import { ReactNode } from "react";
import { getRegularLayout } from "../layouts/RegularLayout";

const Home = () => {
  return <div>hello</div>;
};

Home.getLayout = (page: ReactNode) => getRegularLayout(page, "Home");

export default Home;
