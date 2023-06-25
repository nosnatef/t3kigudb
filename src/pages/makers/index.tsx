import { type NextPage } from "next";

import { api } from "~/utils/api";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";

const Makers: NextPage = () => {

  const router = useRouter();

  const { data: makerData, fetchNextPage, hasNextPage, isFetching } = api.maker.getMakers.useInfiniteQuery({
    limit: 10
  },{
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return (<Layout>
    <div className="container flex items-center justify-center m-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-2 px-4">
          {makerData?.pages ? makerData.pages.map((page) => 
            page.items.map((maker) => (
              <PhotoCard
                key={maker.id.toString()}
                picSrc={maker.picUrl}
                title={maker.name}
              />
            ))
          ) : ""}
        </div>
    </div>
    <div className="flex items-center justify-center">
      {isFetching && <MoonLoader />}
    </div>
  </Layout>)
}

export default Makers;