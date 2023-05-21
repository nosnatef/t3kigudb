import { api } from "~/utils/api";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

const Character: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: maskData } = api.mask.getByCharacterId.useQuery(id);

  return (
    <>
      <Layout>
      <div className="container flex flex-row items-center justify-center m-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-2 px-4">
          {
            maskData ? maskData.map((mask) => {
              return (<PhotoCard 
                key={mask.id}
                picSrc={mask.picUrl}
                title={`${mask.kigu.name}`}
                subTitle="Maker"
              />)
            }) : "Loading"
          }
      </div>
      </div>
      </Layout>
    </>
  )
}

export default Character;