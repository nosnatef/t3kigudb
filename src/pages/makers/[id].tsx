import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "../layout";
import TitleLoader from "~/components/utils/TitleLoader";
import { placeholderImg } from "~/utils/constant";
import Image from "next/image";
import ProfileInfo from "~/components/InfoPage/ProfileInfo";
import * as Tabs from "@radix-ui/react-tabs";
import PhotoCard from "~/components/PhotoCard";
import { LOADING_TEXT } from "~/constants/strings";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import SocialLinkContainer from "~/components/KiguPage/SocialLinkContainer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { getLocaleName } from "~/utils/locale";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
      "ja",
    ])),
  },
});

const Maker: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { t, i18n } = useTranslation("common");

  const { data: makerData } = api.maker.getById.useQuery(Number(id), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const maskData = makerData?.masks ?? [];

  const { name, picUrl, makerLinks } = makerData ?? {};

  const [galleryIndex, setGalleryIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const masksPerPage = 12;

  const indexOfLastMask = currentPage * masksPerPage;
  const indexOfFirstMask = indexOfLastMask - masksPerPage;
  const currentMasks = maskData.slice(indexOfFirstMask, indexOfLastMask);

  const getSlides = () =>
    maskData.map((mask) => {
      return {
        src: mask.picUrl,
      } as Slide;
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // function to handle pagination page changes
  };

  const totalPages = Math.ceil(maskData.length / masksPerPage);

  return (
    <>
      <Layout>
        <div className="container mx-auto px-3 md:px-0">
          {name ? (
            <h3 className="my-4 text-xl font-bold">{name}</h3>
          ) : (
            <TitleLoader />
          )}
          <div className="flex flex-col gap-4 rounded-lg bg-white py-4 md:flex-row">
            <div className="flex flex-row items-center justify-around md:max-h-[80vh] md:w-1/4 md:flex-col">
              <Image
                alt="Image"
                src={picUrl ?? placeholderImg}
                height={200}
                width={200}
                className="h-full max-h-[200px] w-full max-w-[200px] rounded-full object-cover"
              ></Image>
              <div className="flex h-[300px] flex-col justify-around">
                <ProfileInfo
                  stat={maskData.length ?? 0}
                  desc={t("masks-made")}
                />
                <SocialLinkContainer links={makerLinks ?? []} />
              </div>
            </div>
            <div className="md:w-3/4">
              <Tabs.Root
                defaultValue="Masks"
                className="flex min-h-[500px] flex-col"
              >
                <Tabs.List className="shrink-0 border-b">
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Masks"
                  >
                    {t("masks")}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Gallery"
                  >
                    {t("gallery")}
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="Masks" className="p-5">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {currentMasks.length > 0 // modified to display currentMasks
                      ? currentMasks.map((mask) => {
                          return (
                            <PhotoCard
                              key={mask.id}
                              picSrc={mask.picUrl}
                              title={`${getLocaleName(
                                mask.character,
                                i18n.language
                              )}`}
                              href={`/characters/${mask.character.id}`}
                            />
                          );
                        })
                      : LOADING_TEXT}
                  </div>
                  {maskData.length > masksPerPage && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        {/* Show only Previous and Next on small screens (below md) */}
                        <div className="flex justify-between md:hidden">
                          {/* Previous button */}
                          <PaginationItem>
                            <PaginationPrevious
                              className="cursor-pointer" // Add this class
                              onClick={() => {
                                if (currentPage !== 1) {
                                  handlePageChange(currentPage - 1);
                                }
                              }}
                            />
                          </PaginationItem>

                          {/* Next button */}
                          <PaginationItem>
                            <PaginationNext
                              className="cursor-pointer" // Add this class
                              onClick={() => {
                                if (currentPage !== totalPages) {
                                  handlePageChange(currentPage + 1);
                                }
                              }}
                            />
                          </PaginationItem>
                        </div>

                        {/* Show full pagination (Previous, Next, Page Numbers, Ellipses) on md and larger */}
                        <div className="hidden justify-between md:flex">
                          {/* Previous button */}
                          <PaginationItem>
                            <PaginationPrevious
                              className="cursor-pointer" // Add this class
                              onClick={() => {
                                if (currentPage !== 1) {
                                  handlePageChange(currentPage - 1);
                                }
                              }}
                            />
                          </PaginationItem>
                          {/* First page - only show if not on the first page */}
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationLink
                                className="cursor-pointer" // Add this class
                                onClick={() => handlePageChange(1)}
                                isActive={currentPage === 1}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          {/* Ellipsis if current page is far from the first page */}
                          {currentPage > 3 && (
                            <PaginationEllipsis className="cursor-pointer" />
                          )}{" "}
                          {/* Add this class */}
                          {/* Previous page */}
                          {currentPage > 2 && (
                            <PaginationItem>
                              <PaginationLink
                                className="cursor-pointer" // Add this class
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                              >
                                {currentPage - 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          {/* Current page */}
                          <PaginationItem>
                            <PaginationLink isActive>
                              {currentPage}
                            </PaginationLink>
                          </PaginationItem>
                          {/* Next page */}
                          {currentPage < totalPages - 1 && (
                            <PaginationItem>
                              <PaginationLink
                                className="cursor-pointer" // Add this class
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              >
                                {currentPage + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          {/* Ellipsis if current page is far from the last page */}
                          {currentPage < totalPages - 2 && (
                            <PaginationEllipsis className="cursor-pointer" />
                          )}{" "}
                          {/* Add this class */}
                          {/* Last page - only show if not on the last page */}
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationLink
                                className="cursor-pointer" // Add this class
                                onClick={() => handlePageChange(totalPages)}
                                isActive={currentPage === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          {/* Next button */}
                          <PaginationItem>
                            <PaginationNext
                              className="cursor-pointer" // Add this class
                              onClick={() => {
                                if (currentPage !== totalPages) {
                                  handlePageChange(currentPage + 1);
                                }
                              }}
                            />
                          </PaginationItem>
                        </div>
                      </PaginationContent>
                    </Pagination>
                  )}
                </Tabs.Content>
                <Tabs.Content value="Gallery" className="p-5">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {maskData &&
                      maskData.map((mask, index) => (
                        <img
                          key={index}
                          src={mask.picUrl}
                          className="hover:sclae-105 h-full max-h-[200px] w-full max-w-[200px] rounded-lg object-cover transition hover:cursor-pointer hover:shadow-lg"
                          onClick={() => setGalleryIndex(index)}
                        ></img>
                      ))}
                  </div>
                  <Lightbox
                    open={galleryIndex >= 0}
                    index={galleryIndex}
                    close={() => setGalleryIndex(-1)}
                    slides={getSlides()}
                  />
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Maker;
