import { api } from "~/utils/api";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

import * as Tabs from "@radix-ui/react-tabs";

import Image from "next/image";
import { placeholderImg } from "~/utils/constant";
import { useState } from "react";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ProfileInfo from "~/components/InfoPage/ProfileInfo";
import PhotoCardLoader from "~/components/PhotoCardLoader";
import TitleLoader from "~/components/utils/TitleLoader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
    ])),
  },
});

const Character: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { t } = useTranslation('common');

  const { data: characterData } = api.character.getById.useQuery(id);
  const maskData = characterData?.masks ?? [];

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const getSlides = (): Slide[] => {
    const slides: Slide[][] | undefined = characterData?.masks?.map((mask) => {
      return mask.maskPics.map((pic) => {
        return {
          src: pic.link,
        } as Slide;
      });
    });

    return slides?.flatMap((slide) => slide) ?? [];
  };

  const getGalleryImages = () => {
    let i = 0;
    if (maskData) {
      return maskData.map((mask, maskIndex) => {
        return mask.maskPics.map((pic, picIndex) => {
          const key = i++;
          console.log(i);
          return (
            <img
              key={key}
              src={pic.link}
              className="hover:sclae-105 h-full max-h-[200px] w-full max-w-[200px] rounded-lg object-cover transition hover:cursor-pointer hover:shadow-lg"
              onClick={() => setGalleryIndex(key)}
            ></img>
          );
        });
      });
    }
    return "";
  };

  return (
    <>
      <Layout>
        <div className="container mx-auto px-3 md:px-0">
          {characterData ? (
            <h3 className="my-4 text-xl font-bold">{characterData?.name}</h3>
          ) : (
            <TitleLoader />
          )}

          <div className="flex flex-col gap-4 rounded-lg bg-white py-4 md:flex-row">
            <div className="flex flex-row items-center justify-around md:max-h-[80vh] md:w-1/4 md:flex-col">
              <Image
                alt="Image"
                src={characterData?.picUrl ?? placeholderImg}
                height={300}
                width={300}
                className="h-full max-h-[200px] w-full max-w-[200px] rounded-full object-cover"
              ></Image>
              <div className="flex h-[300px] flex-col justify-around">
                <ProfileInfo
                  stat={characterData?.origin?.name ?? "N/A"}
                  desc={t('from')}
                />
                <ProfileInfo
                  stat={characterData?.origin?.type ?? "N/A"}
                  desc={t('media-type')}
                />
                <ProfileInfo
                  stat={characterData?.masks?.length ?? 0}
                  desc={t('masks-made')}
                />
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
                    {t('kigus')}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[45px] px-5 data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                    value="Gallery"
                  >
                    {t('gallery')}
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="Masks" className="p-5">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {maskData.length > 0
                      ? maskData.map((mask) => {
                          return (
                            <PhotoCard
                              key={mask.id}
                              picSrc={mask.picUrl}
                              title={`${mask.kigu.name}`}
                              subTitle={
                                mask.maker?.name ?? t('unidentified-maker')
                              }
                              onClick={() => {
                                void router.push(`/masks/${mask.id}`);
                              }}
                            />
                          );
                        })
                      : Array(12).fill(<PhotoCardLoader />)}
                  </div>
                </Tabs.Content>
                <Tabs.Content value="Gallery" className="p-5">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {getGalleryImages()}
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

export default Character;
