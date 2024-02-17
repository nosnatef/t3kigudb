import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BiSearch, BiX } from "react-icons/bi";

import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Layout from "./layout";
import PhotoCard from "~/components/PhotoCard";

import { useDebouncedCallback } from "use-debounce";

import { useRouter } from "next/router";
import Link from "next/link";
import SearchResultCard from "~/components/SearchBar/SearchResultCard";
import { placeholderImg } from "~/utils/constant";
import { MoonLoader } from "react-spinners";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { DicesIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useMediaQuery } from "react-responsive";

const Home: NextPage = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("Characters");
  const { data: characterData, isFetching: isCharacterFetching } =
    api.character.getByName.useQuery(query, {
      enabled: query.length > 0 && currentTab === "Characters",
    });

  const { data: kiguData, isFetching: isKiguFetching } =
    api.kigu.getByName.useQuery(query, {
      enabled: query.length > 0 && currentTab === "Kigus",
    });

  const { data: makerData, isFetching: isMakerFetching } =
    api.maker.getByName.useQuery(query, {
      enabled: query.length > 0 && currentTab === "Makers",
    });

  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 500);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <Layout>
        <div
          className={`mx-auto flex min-h-[80vh] max-w-5xl px-4 py-4 ${
            isTabletOrMobile ? "" : "justify-center"
          } flex-col`}
        >
          <div className="flex flex-row justify-between">
            <div className="mb-8 flex flex-row gap-4">
              <div className="text-5xl font-semibold">Discover</div>
              <div className="text-5xl font-semibold text-[#FF5EC8]">KIGUS</div>
            </div>
            {!isTabletOrMobile && (
              <div className="">
                <Button
                  className="bg-[#f7eaf5] hover:bg-[#f0deed] text-black shadow-sm"
                  onClick={() => {
                    void router.push("/kigus/random");
                  }}
                >
                  <DicesIcon className="mr-2" />
                  Random Kigu
                </Button>
              </div>
            )}
          </div>

          <div className="flex h-[50px] flex-row items-center rounded-lg bg-white px-4">
            <BiSearch size={20} />
            <input
              className="h-full w-full rounded-lg p-2 outline-none"
              autoFocus
              placeholder="Search For Kigu/Character/Maker..."
              onChange={(e) => debounced(e.target.value)}
            ></input>
          </div>
          <div className="px-2 py-4">
            <span className="text-sm">Want to contribute to KiguDB? </span>
            <Link
              className="text-sm font-bold text-[#FF5EC8]"
              href="https://forms.gle/hzicLyx5VtJWuAjD9"
              target="_blank"
            >
              Add Kigu Here
            </Link>
            <span className="text-sm"> (Yes, you can add yourself!)</span>
          </div>
          {isTabletOrMobile && (
            <Button
              className="max-w-[200px] bg-[#F9F1F8] shadow-sm"
              onClick={() => {
                void router.push("/kigus/random");
              }}
            >
              <DicesIcon className="mr-2" />
              Random Kigu
            </Button>
          )}
          {query.length > 0 && (
            <div className="mt-8">
              <Tabs.Root
                defaultValue="Characters"
                className="flex min-h-[500px] flex-col"
                onValueChange={(value) => {
                  setCurrentTab(value);
                }}
              >
                <Tabs.List className="shrink-0 border-b">
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Characters"
                  >
                    Characters
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Kigus"
                  >
                    Kigus
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Makers"
                  >
                    Makers
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
                      <h3>No Results Found</h3>
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
                            mainContent={`${kigu.masks.length} masks owned`}
                          />
                        ))
                      : ""}
                  </div>
                  {kiguData && kiguData.length === 0 && (
                    <div className="flex items-center justify-center">
                      <h3>No Results Found</h3>
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
                      <h3>No Results Found</h3>
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
