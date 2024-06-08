import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { BiSearch } from "react-icons/bi";
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
} from "~/components/MenuBar/NavigationMenu";
import Link from "next/link";
import { api } from "~/utils/api";
import NavigationMenuListItem from "~/components/MenuBar/NavigationMenuListItem";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { isSignedIn } = useUser();

  return (
    <section className="h-screen">
      {/* Include shared UI here e.g. a header or sidebar */}
      <header className="border-b border-gray-200 bg-white">
        <div
          className={`mx-auto flex max-w-7xl ${
            isTabletOrMobile ? "justify-between" : "justify-none"
          } px-2 py-4`}
        >
          <div
            className="flex flex-row justify-between gap-4 hover:cursor-pointer"
            onClick={() => {
              void router.push("/");
            }}
          >
            <p className="py-2 font-sans text-xl font-semibold">
              Kigu
              <span className="text-[#FF5EC8]">DB</span>
            </p>
            {isSignedIn ? <Badge variant="destructive">Admin Mode</Badge> : ""}
          </div>
          {isTabletOrMobile ? (
            <ClientOnly>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowMenu(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </ClientOnly>
          ) : (
            <NavigationMenu className="ml-4">
              <NavigationMenuList>
                <NavigationMenuItem className="flex items-center justify-center rounded-lg py-1 hover:bg-slate-100">
                  <NavigationMenuTrigger className="flex flex-row">
                    Character
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white">
                    <ul className="flex w-[335px] flex-col gap-3 p-4">
                      <li>
                        <NavigationMenuListItem
                          title="Trending Character"
                          content="Kigus' favorite characters"
                          link="/characters/popular"
                        />
                      </li>
                      <li>
                        <NavigationMenuListItem
                          title="All"
                          content="All masks"
                          link="/characters"
                        />
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex items-center justify-center rounded-lg py-1 hover:bg-slate-100">
                  <NavigationMenuTrigger className="flex flex-row">
                    Maker
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white">
                    <ul className="flex w-[335px] flex-col gap-3 p-4">
                      <li>
                        <NavigationMenuListItem
                          title="All"
                          content="All makers"
                          link="/makers"
                        />
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </header>
      {isTabletOrMobile && (
        <ClientOnly>
          <BackDrop onClick={() => setShowMenu(false)} isShown={showMenu} />
          <div
            className={`fixed right-0 top-0 h-full w-64 transition-transform ${
              showMenu ? "translate-x-0" : "translate-x-full"
            } z-50 bg-white`}
          >
            <div className="flex flex-col px-4 py-4">
              <div className="flex flex-row justify-between">
                <p className="pl-2 font-sans font-semibold">KiguDB</p>
                <div
                  className="rounded-lg hover:cursor-pointer hover:bg-gray-200"
                  onClick={() => setShowMenu(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              <div className="my-2 border-t border-gray-300"></div>
              <MenuItem
                label="Home"
                onClick={() => {
                  void router.push("/");
                }}
                pathName="/"
              />
              <MenuItem
                label="Random Kigu"
                onClick={() => {
                  void router.push("/kigus/random");
                }}
                pathName="/kigus/random"
              />
              <MenuItem
                label="All Characters"
                onClick={() => {
                  void router.push("/characters");
                }}
                pathName="/characters"
              />
              <MenuItem
                label="Most Popular Characters"
                onClick={() => {
                  void router.push("/characters/popular");
                }}
                pathName="/characters/popular"
              />
              <MenuItem
                label="All Makers"
                onClick={() => {
                  void router.push("/makers");
                }}
                pathName="/makers"
              />
              <div className="my-2 border-t border-gray-300"></div>
              <a href="https://forms.gle/hzicLyx5VtJWuAjD9" target="_blank">
                <div className="flex h-10 items-center rounded-lg py-2 pl-2 hover:cursor-pointer hover:bg-gray-100">
                  <p className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                    Add Kigu
                  </p>
                </div>
              </a>
              <div className="fixed bottom-2 pl-2 text-sm">
                Last Updated: 06-27-2023
              </div>
            </div>
          </div>
        </ClientOnly>
      )}

      {children}
      <div className="mt-auto">
        <div className="mx-2 my-2 border-t border-gray-300"></div>
        <div className="flex justify-center px-2 pb-4">
          KiguDB, Built by Ringo
        </div>
      </div>
    </section>
  );
}
