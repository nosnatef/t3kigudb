import { type NextPage } from "next";

import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Layout from "../layout";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PhotoCard from "~/components/PhotoCard";

import { useRouter } from "next/router";
import PhotoCardLoader from "~/components/PhotoCardLoader";
import MoonLoader from "react-spinners/MoonLoader";
import { LOADING_TEXT } from "~/constants/strings";

const Characters: NextPage = () => {
  const router = useRouter();

  const [origin, setOrigin] = useState("Genshin Impact");
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    data: characterData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = api.character.getByOrigin.useInfiniteQuery(
    {
      limit: 10,
      origin: origin,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const allOrigins = api.origin.getAll.useQuery();

  const handleOriginChange = (val: string) => {
    setOrigin(val);
  };

  const handleObserver: IntersectionObserverCallback = ([entry]) => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.9,
    });
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => observer.disconnect();
  }, [bottomRef, hasNextPage, isFetching]);

  return (
    <>
      <Layout>
        <div className="container m-auto flex flex-row justify-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="my-2 rounded-md bg-white px-5 py-2 shadow-md hover:cursor-pointer">
              Select Media
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] divide-y divide-gray-300 rounded-md bg-white p-[5px] shadow-md"
                sideOffset={3}
              >
                {allOrigins.data
                  ? allOrigins.data.map((origin) => {
                      return (
                        <DropdownMenu.Item
                          key={origin.name}
                          onClick={() => handleOriginChange(origin.name)}
                          className="h-[30px] px-[5px] hover:cursor-pointer hover:bg-slate-200"
                        >
                          {origin.name}
                        </DropdownMenu.Item>
                      );
                    })
                  : LOADING_TEXT}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div className="container m-auto flex flex-row items-center justify-center">
          <div className="grid grid-cols-2 gap-4 px-4 py-2 md:grid-cols-4 lg:grid-cols-6">
            {characterData?.pages
              ? characterData.pages.map((page) =>
                  page.items.map((char) => (
                    <PhotoCard
                      key={char.id}
                      picSrc={char.picUrl}
                      title={char.name}
                      subTitle={char.origin.name}
                      onClick={() => {
                        void router.push(`/characters/${char.id}`);
                      }}
                    />
                  ))
                )
              : Array(10).fill(<PhotoCardLoader />)}
            {characterData?.pages && <div ref={bottomRef} />}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isFetching && <MoonLoader />}
        </div>
      </Layout>
    </>
  );
};

export default Characters;
