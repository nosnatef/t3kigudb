import { NextPage } from "next";
import { api } from "~/utils/api";
import Layout from "../layout";
import { MoonLoader } from "react-spinners";
import PhotoCardLoader from "~/components/PhotoCardLoader";
import { useRouter } from "next/router";
import PhotoCard from "~/components/PhotoCard";

const Character: NextPage = () => {
  const router = useRouter();
  const { data: characterData, isFetching } =
    api.character.getMostPopular.useQuery();

  return (
    <>
      <Layout>
        <div className="container m-auto flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 px-4 py-2 md:grid-cols-4 lg:grid-cols-6">
            {characterData
              ? characterData.map((item) => (
                  <PhotoCard
                    key={item.id}
                    picSrc={item.picUrl}
                    title={`(${item.masks.length}) ${item.name}`}
                    subTitle={item.origin.name}
                    onClick={() => {
                      void router.push(`/characters/${item.id}`);
                    }}
                  />
                ))
              : Array(12).fill(<PhotoCardLoader />)}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isFetching && <MoonLoader />}
        </div>
      </Layout>
    </>
  );
};

export default Character;
