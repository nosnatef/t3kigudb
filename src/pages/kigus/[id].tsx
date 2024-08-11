import { type NextPage } from "next";
import Layout from "../layout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import { placeholderImg } from "~/utils/constant";
import ProfileInfo from "~/components/InfoPage/ProfileInfo";
import * as Tabs from "@radix-ui/react-tabs";
import PhotoCard from "~/components/PhotoCard";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import SocialLinkContainer from "~/components/KiguPage/SocialLinkContainer";
import { LOADING_TEXT } from "~/constants/strings";
import TitleLoader from "~/components/utils/TitleLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
      "ja",
    ])),
  },
});

const Kigu: NextPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const id = router.query.id as string;

  const { t } = useTranslation("common");

  const { data: kiguData } = api.kigu.getById.useQuery(id, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { mutate } = api.kigu.deleteById.useMutation();
  const maskData = kiguData?.masks ?? [];

  const { name, picUrl, socialLinks } = kiguData ?? {};

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const getSlides = () =>
    maskData.map((mask) => {
      return {
        src: mask.picUrl,
      } as Slide;
    });

  return (
    <>
      <Layout>
        <div className="container mx-auto px-3 md:px-0">
          {name ? (
            <h3 className="my-4 text-xl font-bold">{name}</h3>
          ) : (
            <TitleLoader />
          )}
          {isSignedIn && (
            <Dialog>
              <DialogTrigger>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    The deleted entry can be retrieved but you cannot undo the
                    action.
                  </DialogDescription>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      mutate(id);
                      window.location.reload();
                    }}
                    type="submit"
                  >
                    Delete
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex flex-col gap-4 rounded-lg bg-white py-4 md:flex-row">
            <div className="flex flex-row items-center justify-around md:w-1/4 md:flex-col">
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
                  desc={t("masks-owned")}
                />
                <SocialLinkContainer links={socialLinks ?? []} />
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
                    {maskData
                      ? maskData.map((mask) => {
                          return (
                            <PhotoCard
                              key={mask.id}
                              picSrc={mask.picUrl}
                              title={`${mask.character.name}`}
                              subTitle={
                                mask.maker?.name ?? t("unidentified-maker")
                              }
                              onClick={() => {
                                void router.push(`/masks/${mask.id}`);
                              }}
                            />
                          );
                        })
                      : LOADING_TEXT}
                  </div>
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

export default Kigu;
