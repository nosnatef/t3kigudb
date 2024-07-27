/* eslint-disable */

import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";
import { useRouter } from "next/router";
import PhotoCardLoader from "~/components/PhotoCardLoader";
import { MoonLoader } from "react-spinners";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { BiSearch } from "react-icons/bi";
import { useDebouncedCallback } from "use-debounce";

const Media: NextPage = () => {
  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 500);

  const router = useRouter();
  const [query, setQuery] = useState("");
  const id = router.query.id as string;
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    data: characterData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = api.character.getByOrigin.useInfiniteQuery(
    {
      limit: 10,
      origin: parseInt(id),
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data: characterSearchData, isFetching: isCharacterFetching } =
    api.character.getByName.useQuery(
      { name: query, originId: parseInt(id) },
      {
        enabled: query.length > 0,
      }
    );

  const { data: originData } = api.origin.getById.useQuery(parseInt(id));

  const handleObserver: IntersectionObserverCallback = ([entry]) => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  };

  const getCharacterList = () => {
    if (query.length > 0) {
      if (characterSearchData) {
        return characterSearchData.map((char) => (
          <PhotoCard
            key={char.id}
            picSrc={char.picUrl}
            title={char.name}
            subTitle={char.origin.name}
            onClick={() => {
              void router.push(`/characters/${char.id}`);
            }}
          />
        ));
      }
    } else if (characterData) {
      return characterData.pages.map((page) =>
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
      );
    }

    return Array(10).fill(<PhotoCardLoader />);
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
    <Layout>
      <div className="container m-auto flex flex-col gap-8 py-8">
        <div>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/media">Media</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>{originData?.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="flex h-[50px] flex-row items-center rounded-lg bg-white px-4">
          <BiSearch size={20} />
          <input
            className="h-full w-full rounded-lg p-2 outline-none"
            autoFocus
            placeholder={`Search for characters from ${originData?.name}`}
            onChange={(e) => debounced(e.target.value)}
          ></input>
        </div>
        <div className="flex w-full flex-row items-center justify-center">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {getCharacterList()}
            {characterData?.pages && <div ref={bottomRef} />}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isFetching && <MoonLoader />}
        </div>
      </div>
    </Layout>
  );
};

export default Media;
