import { BiSearch, BiX } from "react-icons/bi";
import BackDrop from "../BackDrop";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { placeholderImg } from "~/utils/constant";
import { debounce } from "lodash";

import { api } from "~/utils/api";

import Image from "next/image";
import SearchResultCard from "./SearchResultCard";

const SearchBar: React.FC = () => {
  const [inSearch, setInSearch] = useState(false);
  const [query, setQuery] = useState("");

  const { data: characterData } = api.character.getByName.useQuery(query);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const debouncedSearchHandler = debounce(searchHandler, 500);

  useEffect(() => {
    if (characterData) {
      console.log(characterData);
    }
  }, [characterData]);

  return (
    <>
      <div
        className="w-auto cursor-pointer rounded-full border-[1px] bg-white py-2 pl-2 pr-32 shadow-sm transition hover:shadow-md"
        onClick={() => {
          setInSearch(true);
        }}
      >
        <div className="flex flex-row items-center gap-3 text-gray-600">
          <BiSearch size={20} />
          <div className="block">Search For Kigu</div>
        </div>
      </div>
      <BackDrop
        isShown={inSearch}
        onClick={() => {
          setInSearch(false);
        }}
      />
      {inSearch && (
        <div className="fixed inset-0 top-4 z-50 overflow-hidden overflow-y-auto md:top-8">
          <div
            className={`mx-auto flex w-4/5 max-w-3xl flex-col justify-center gap-4 overflow-hidden`}
          >
            <div className="flex flex-row gap-4">
              <input
                className="w-full rounded-lg border p-2"
                autoFocus
                onChange={debouncedSearchHandler}
              ></input>
              <div
                className="flex items-center justify-center rounded-lg border border-black hover:cursor-pointer"
                onClick={() => {
                  setInSearch(false);
                }}
              >
                <BiX size={32} />
              </div>
            </div>
            {characterData && query ? (
              characterData.map((char) => (
                <SearchResultCard
                  key={char.id}
                  imgSrc={char.picUrl}
                  title={char.name}
                  imgDesc="Character"
                  mainContent={`From ${char.origin.name}`}
                  subContent="Mask count: 100"
                  link={`/characters/${char.id}`}
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
