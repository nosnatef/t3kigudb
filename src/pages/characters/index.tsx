import { type NextPage } from "next";

import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Layout from "../layout";

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import PhotoCard from "~/components/PhotoCard";

import { useRouter } from "next/router";

const Characters: NextPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(0);  
  const [origin, setOrigin] = useState("Genshin Impact");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: characterData, fetchNextPage, hasNextPage, isFetching } = api.character.getByOrigin.useInfiniteQuery({
    limit: 10,
    origin: origin
  },{
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  const allOrigins = api.origin.getAll.useQuery();

  const handleOriginChange = (val: string) => {
    setOrigin(val);
  }

  const handleObserver: IntersectionObserverCallback = ([entry]) => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => observer.disconnect();
  }, [bottomRef, hasNextPage, isFetching]);

  return(
    <>
      <Layout>
      <div className="container flex flex-row justify-center m-auto">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="shadow-md rounded-md px-5 my-2 py-2 hover:cursor-pointer">
          Select Media
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
        <DropdownMenu.Content
            className="bg-white rounded-md shadow-md min-w-[220px] p-[5px] divide-y divide-gray-300"
            sideOffset={3}
          >
            {allOrigins.data ? allOrigins.data.map((origin) => {
            return (
              <DropdownMenu.Item
                key={origin.name}
                onClick={() => handleOriginChange(origin.name)}
                className="h-[30px] px-[5px] hover:bg-slate-200 hover:cursor-pointer"
              >
                {origin.name}
              </DropdownMenu.Item>
            )
          }) : "Loading..."}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      </div>
      <div className="container flex flex-row items-center justify-center m-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-2 px-4">
          {characterData?.pages ? characterData.pages.map((page) => 
            page.items.map((char) => (
              <PhotoCard
                key={char.id}
                picSrc={char.picUrl}
                title={char.name}
                subTitle={char.origin.name}
                onClick={() => {router.push(`/characters/${char.id}`)}}
              />
            ))
          ) : "Nothing"}
          {characterData?.pages && (<div ref={bottomRef} />)}
          {isFetching && <div>Loading More...</div>}
        </div>
        
      </div>
      </Layout>
    </>
  )

}

export default Characters;