import { NextPage } from "next";
import Layout from "../layout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect } from "react";

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

  return <Layout></Layout>;
};

export default RandomKig;
