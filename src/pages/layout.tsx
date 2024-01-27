import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'

import { BiSearch } from 'react-icons/bi'
import MenuItem from "~/components/MenuBar/MenuItem";
import { useRouter } from "next/router";
import ClientOnly from "~/components/ClientOnly";
import BackDrop from "~/components/BackDrop";
import SearchBar from "~/components/SearchBar/SearchBar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "~/components/MenuBar/NavigationMenu"
import Link from "next/link";
import { api } from "~/utils/api";
import NavigationMenuListItem from "~/components/MenuBar/NavigationMenuListItem";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <section className="h-screen">
      {/* Include shared UI here e.g. a header or sidebar */}
      <header className="bg-white border-b border-gray-200">
        <div className={`max-w-7xl mx-auto flex ${isTabletOrMobile ? "justify-between" : "justify-none"} py-4 px-2`}>
        <div className="flex flex-row justify-between gap-4 hover:cursor-pointer" onClick={() => {void router.push('/')}}>
          <p className="font-semibold font-sans text-xl py-2">Kigu
            <span className="text-[#4E60FF]">DB</span>
          </p>
        </div>
        { isTabletOrMobile ? (
          <ClientOnly>
            <button className="bg-gray-200 hover:bg-gray-300 rounded-lg w-10 h-10 flex items-center justify-center" onClick={() => setShowMenu(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </ClientOnly>
         ) : (
          <NavigationMenu className="ml-4">
            <NavigationMenuList>
              <NavigationMenuItem className="hover:bg-slate-100 rounded-lg flex justify-center items-center py-1">
                <Link href={`/kigus/random`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Random Kigu
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hover:bg-slate-100 rounded-lg flex justify-center items-center py-1">
                <NavigationMenuTrigger className="flex flex-row">Character</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid gap-3 p-4 w-[500px] grid-cols-2">
                    <li>
                      <NavigationMenuListItem title="All" content="All Characters" link="/characters" />
                    </li>
                    <li>
                      <NavigationMenuListItem title="Most Masks" content="Characters with most masks" link="/characters/popular" />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="hover:bg-slate-100 rounded-lg flex justify-center items-center py-1">
                <NavigationMenuTrigger className="flex flex-row">Maker</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid gap-3 p-4 w-[500px] grid-cols-2">
                    <li>
                      <NavigationMenuListItem title="All" content="All Makers" link="/makers" />
                    </li>
                    <li>
                      <NavigationMenuListItem title="Most Masks" content="Makers with most masks" link="/" />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
         )}
        </div>
      </header>
      { isTabletOrMobile &&
      (<ClientOnly>
      <BackDrop
        onClick={() => setShowMenu(false)}
        isShown={showMenu}
      />
      <div className={`fixed top-0 right-0 h-full w-64 transition-transform ${showMenu ? "translate-x-0" : "translate-x-full"} bg-white z-50`}>
        <div
          className="flex flex-col py-4 px-4" 
        >
          <div className="flex flex-row justify-between">
            <p className="font-semibold font-sans pl-2">KiguDB</p>
            <div className="hover:cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => setShowMenu(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <div className="border-t border-gray-300 my-2"></div>
          <MenuItem
            label="Home"
            onClick={() => {void router.push("/")}}
            pathName="/"
          />
          <MenuItem
            label="Random Kigu"
            onClick={() => {void router.push("/kigus/random")}}
            pathName="/kigus/random"
          />
          <MenuItem
            label="All Characters"
            onClick={() => {void router.push("/characters")}}
            pathName="/characters"
          />
          <MenuItem
            label="Most Popular Characters"
            onClick={() => {void router.push("/characters/popular")}}
            pathName="/characters/popular"
          />
          <MenuItem
            label="All Makers"
            onClick={() => {void router.push("/makers")}}
            pathName="/makers"
          />
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            Makers With Most Masks
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            <p className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">Add Kigu</p>
          </div>
          <div className="pl-2 fixed bottom-2 text-sm">Last Updated: 06-27-2023</div>
        </div>
      </div>
      </ClientOnly>)
      }
      

      
      
      {children}
      <div className="mt-auto">
        <div className="border-t border-gray-300 my-2 mx-2"></div>
        <div className="px-2 pb-4 flex justify-center">KiguDB, Built by Ringo</div>
      </div>
      
    </section>
  );
}