import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BiSearch, BiX } from "react-icons/bi";

import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Layout from "./layout";
import PhotoCard from "~/components/PhotoCard";

import { useDebouncedCallback } from 'use-debounce';

import { useRouter } from "next/router";
import Link from "next/link";
import SearchResultCard from "~/components/SearchBar/SearchResultCard";
import { placeholderImg } from "~/utils/constant";
import { MoonLoader } from "react-spinners";

const Home: NextPage = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const {data: characterData, isFetching} = api.character.getByName.useQuery(query,
    { 
      enabled: query.length > 0
    }
  );

  const debounced = useDebouncedCallback(
    (value: string) => {
      setQuery(value);
    },
    500
  );
  

  return (
    <>
      <Layout>
            
      <div className="min-h-[80vh] max-w-7xl mx-auto py-4 px-4">
        <div className="flex justify-center w-full mt-4 mb-12 font-semibold text-2xl">
          Discover Kigus
        </div>
        <div className="h-[50px] bg-white rounded-lg flex flex-row items-center px-4">
            <BiSearch size={20} />
            <input
              className="rounded-lg p-2 w-full h-full outline-none"
              autoFocus
              placeholder="Search For Kigu/Character/Maker..."
              onChange={(e) => debounced(e.target.value)}
            ></input>
        </div>
        <div
          className="py-4 px-2"
        >
          <span className="text-sm">Want to contribute to KiguDB?  </span>
          <Link className="text-sm text-blue-600" href="/">Add Kigu Here</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {characterData ? characterData.map((char) => (
            <SearchResultCard
            imgSrc={char.picUrl}
            title={char.name}
            link={`/characters/${char.id}`}
            key={char.id}
            mainContent={char.origin.name}
            subContent={char.origin.type}
          />
          )) : ""}
        </div>
        {isFetching && <div className="flex justify-center items-center">
          <MoonLoader />  
        </div>}
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
    { enabled: sessionData?.user !== undefined },
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
