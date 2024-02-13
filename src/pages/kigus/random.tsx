import { NextPage } from "next";
import Layout from "../layout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { MoonLoader } from "react-spinners";

const RandomKig: NextPage = () => {
  const router = useRouter();
  const { data: randomKiguData } = api.kigu.getOneRandom.useQuery();

  useEffect(() => {
    if (randomKiguData && randomKiguData.length > 0) {
      void router.push(
        `/kigus/${randomKiguData[0] ? randomKiguData[0].id : ""}`
      );
    }
  }, [randomKiguData]);

  return <Layout>
    <div className="flex justify-center">
      <MoonLoader />
    </div>
  </Layout>;
};

export default RandomKig;
