import { type NextPage } from "next";
import Layout from "../layout";
import { ArrowRight } from "lucide-react";
import { api } from "~/utils/api";
import MediaCard from "~/components/MediaPage/MediaCard";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
    ])),
  },
});

const Media: NextPage = () => {
  const allOrigins = api.origin.getAll.useQuery();
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="mx-auto flex max-w-7xl transform flex-col gap-4 px-4 py-4 ">
        <h2 className="text-xl font-bold">{t('find-characters-by')}</h2>
        <Separator />
        <div className="grid gap-4">
          {allOrigins.data &&
            Object.entries(allOrigins.data).map(([type, origins]) => (
              <div key={type}>
                <h2 className="mb-4 text-xl font-bold">{type}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {origins.map((origin) => (
                    <MediaCard key={origin.id} originData={origin} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Media;
