import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiSearch } from "react-icons/bi";

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Layout from "./layout";

import { useDebouncedCallback } from "use-debounce";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/router";
import Link from "next/link";
import SearchResultCard from "~/components/SearchBar/SearchResultCard";
import { MoonLoader } from "react-spinners";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { DicesIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
      "ja",
    ])),
  },
});

const Home: NextPage = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("Characters");
  const { data: characterData, isFetching: isCharacterFetching } =
    api.character.getByName.useQuery(
      { name: query },
      {
        enabled: query.length > 0 && currentTab === "Characters",
      }
    );

  const { data: kiguData, isFetching: isKiguFetching } =
    api.kigu.getByName.useQuery(query, {
      enabled: query.length > 0 && currentTab === "Kigus",
    });

  const { data: makerData, isFetching: isMakerFetching } =
    api.maker.getByName.useQuery(query, {
      enabled: query.length > 0 && currentTab === "Makers",
    });

  const updateUrl = (query: string, tab: string) => {
    void router.push(
      {
        pathname: router.pathname,
        query: { query, tab },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    updateUrl(query, value);
  };

  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value);
    updateUrl(value, currentTab);
  }, 500);

  useEffect(() => {
    const { query, tab } = router.query;
    if (typeof query === "string") setQuery(query);
    if (typeof tab === "string") setCurrentTab(tab);
  }, [router.query]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { t } = useTranslation("common");

  return (
    <>
      <Layout>
        <div
          className={`mx-auto flex min-h-[80vh] max-w-5xl px-4 py-4 ${
            isTabletOrMobile ? "" : "justify-center"
          } flex-col`}
        >
          <div className="flex flex-row justify-between">
            <div className="mb-8 flex flex-auto flex-row justify-center gap-4 md:justify-start">
              <h1 className="text-3xl font-semibold md:text-5xl">
                {t("discover")}
              </h1>
              <h1 className="text-3xl font-semibold text-[#FF5EC8] md:text-5xl">
                {t("kigus-cap")}
              </h1>
            </div>
            {!isTabletOrMobile && (
              <div className="">
                <Button
                  className="bg-[#f7eaf5] text-black shadow-sm hover:bg-[#f0deed]"
                  onClick={() => {
                    void router.push("/kigus/random");
                  }}
                >
                  <DicesIcon className="mr-2" />
                  {t("random-kigu")}
                </Button>
              </div>
            )}
          </div>

          <div className="flex h-[50px] flex-row items-center rounded-lg bg-white px-4">
            <BiSearch size={20} />
            <input
              className="h-full w-full rounded-lg p-2 outline-none"
              autoFocus
              placeholder={t("search-for-kigu")}
              onChange={(e) => debounced(e.target.value)}
            ></input>
          </div>
          <div className="px-2 py-4">
            <span className="text-sm">{t("want-to-contribute")} </span>
            <Link
              className="text-sm font-bold text-[#FF5EC8]"
              href={t("form-link")}
              target="_blank"
            >
              {t("add-kigu-here")}
            </Link>
            <span className="text-sm">{t("yes-you-can")}</span>
          </div>
          {isTabletOrMobile && (
            <Button
              className="bg-[#f7eaf5] text-black shadow-sm hover:bg-[#f0deed]"
              onClick={() => {
                void router.push("/kigus/random");
              }}
            >
              <DicesIcon className="mr-2" />
              {t("random-kigu")}
            </Button>
          )}
          {query.length > 0 && (
            <div className="mt-8">
              <Tabs.Root
                defaultValue={currentTab}
                className="flex min-h-[500px] flex-col"
                onValueChange={handleTabChange}
              >
                <Tabs.List className="shrink-0 border-b">
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Characters"
                  >
                    {t("characters")}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Kigus"
                  >
                    {t("kigus")}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Makers"
                  >
                    {t("makers")}
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="Characters" className="p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {characterData
                      ? characterData.map((char) => (
                          <SearchResultCard
                            imgSrc={char.picUrl}
                            title={char.name}
                            link={`/characters/${char.id}`}
                            key={char.id}
                            mainContent={char.origin.name}
                            subContent={char.origin.type}
                          />
                        ))
                      : ""}
                  </div>
                  {characterData && characterData.length === 0 && (
                    <div className="flex items-center justify-center">
                      <h3>{t("no-results")}</h3>
                    </div>
                  )}
                  {isCharacterFetching && (
                    <div className="flex items-center justify-center">
                      <MoonLoader />
                    </div>
                  )}
                </Tabs.Content>
                <Tabs.Content value="Kigus" className="p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {kiguData
                      ? kiguData.map((kigu) => (
                          <SearchResultCard
                            imgSrc={kigu.picUrl}
                            title={kigu.name}
                            link={`/kigus/${kigu.id}`}
                            key={kigu.id}
                            mainContent={`${kigu.masks.length} ${t(
                              "masks-owned"
                            )}`}
                          />
                        ))
                      : ""}
                  </div>
                  {kiguData && kiguData.length === 0 && (
                    <div className="flex items-center justify-center">
                      <h3>{t("no-results")}</h3>
                    </div>
                  )}
                  {isKiguFetching && (
                    <div className="flex items-center justify-center">
                      <MoonLoader />
                    </div>
                  )}
                </Tabs.Content>
                <Tabs.Content value="Makers" className="p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {makerData
                      ? makerData.map((maker) => (
                          <SearchResultCard
                            imgSrc={maker.picUrl}
                            title={maker.name}
                            link={`/makers/${maker.id}`}
                            key={maker.id}
                          />
                        ))
                      : ""}
                  </div>
                  {makerData && makerData.length === 0 && (
                    <div className="flex items-center justify-center">
                      <h3>{t("no-results")}</h3>
                    </div>
                  )}
                  {isMakerFetching && (
                    <div className="flex items-center justify-center">
                      <MoonLoader />
                    </div>
                  )}
                </Tabs.Content>
              </Tabs.Root>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
