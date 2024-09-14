import { type NextPage } from "next";

import { api } from "~/utils/api";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
      "ja",
    ])),
  },
});

const Makers: NextPage = () => {
  const router = useRouter();

  const {
    data: makerData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = api.maker.getMakers.useInfiniteQuery(
    {
      limit: 50,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Layout>
      <div className="container m-auto flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 px-4 py-2 md:grid-cols-4 lg:grid-cols-6">
          {makerData?.pages
            ? makerData.pages.map((page) =>
                page.items.map((maker) => (
                  <PhotoCard
                    key={maker.id.toString()}
                    picSrc={maker.picUrl}
                    title={maker.name}
                    href={`/makers/${maker.id}`}
                  />
                ))
              )
            : ""}
        </div>
      </div>
      <div className="flex items-center justify-center">
        {isFetching && <MoonLoader />}
      </div>
    </Layout>
  );
};

export default Makers;
