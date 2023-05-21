import { BiSearch, BiX } from "react-icons/bi";
import {} from "react-icons/"
import BackDrop from "../BackDrop";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { placeholderImg } from "~/utils/constant";
import { debounce } from 'lodash';


import { api } from "~/utils/api";

import Image from "next/image";
import SearchResultCard from "./SearchResultCard";

const SearchBar: React.FC = () => {

  const [inSearch, setInSearch] = useState(false);
  const [query, setQuery] = useState("");

  const {data: characterData} = api.character.getByName.useQuery(query);

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  const debouncedSearchHandler = debounce(searchHandler, 500);

  useEffect(() => {
    if(characterData) {
      console.log(characterData);
    }
  }, [characterData]);



  return (
    <>
      <div className="border-[1px] w-auto bg-white rounded-full pl-2 pr-32 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
        onClick={() => {
          setInSearch(true);
        }}
      >
        <div className="text-gray-600 flex flex-row items-center gap-3">
          <BiSearch size={20} />
          <div className="block">Search For Kigu</div>
        </div>
      </div>
      <BackDrop 
      isShown={inSearch}
      onClick={() => {setInSearch(false)}}
      />
      {inSearch && (

        <div
          className="fixed inset-0 z-50 overflow-y-auto top-4 md:top-8 overflow-hidden"
        >

        
        <div
        className={`flex flex-col gap-4 justify-center w-4/5 max-w-3xl mx-auto overflow-hidden`}>
          <div className="flex flex-row gap-4">
            <input
              className="rounded-lg p-2 w-full border"
              autoFocus
              onChange={debouncedSearchHandler}
            ></input>
            <div
              className="hover:cursor-pointer border border-black flex justify-center items-center rounded-lg"
              onClick={() => {setInSearch(false)}}
            >
              <BiX size={32} />
            </div>
          </div>
          {(characterData && query) ? characterData.map((char) => (
            <SearchResultCard
              key={char.id}
              imgSrc={char.picUrl}
              title={char.name}
              imgDesc="Character"
              mainContent={`From ${char.origin.name}`}
              subContent="Mask count: 100"
              link={`/characters/${char.id}`}
            />
          )) : (<></>)}
        </div>
        </div>
      )}
      
    </>
    
  );
}
 
export default SearchBar;