import { NextPage } from "next";
import Layout from "../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { placeholderImg } from "~/utils/constant";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Mask: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: maskData } = api.mask.getById.useQuery(id);

  const { character, maskPics, picUrl: maskPic, maker } = maskData ?? {};
  const { kigu } = maskData ?? {};
  const { picUrl: makerPic, name: makerName, id: makerId } = maker ?? {};
  const { name: characterName, id: characterId, picUrl: characterPic, origin } = character ?? {};
  const { name: originName } = origin ?? {};
  const { name: kiguName, picUrl: kigPic, id: kiguId } = kigu ?? {}

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const getSlides = (): Slide[] => {
    if (maskPics) {
      return maskPics.map((pic) => {
        return {
          src: pic.link,
        } as Slide;
      })
    }
    return [];
  };

  const getGalleryImages = useCallback(() => {
    let i = 0;
    if (maskPics) {
      return maskPics.map((pic, picIndex) => {
          const key = i++;
          console.log(i);
          return (
            <img
              key={key}
              src={pic.link}
              className="hover:scale-105 h-full max-h-[300px] w-full max-w-[300px] rounded-lg object-cover transition hover:cursor-pointer hover:shadow-lg"
              onClick={() => setGalleryIndex(key)}
            ></img>
          );
        });
    }
    return "";
  },[maskPics]);

  return (
    <>
      <Layout>
        <div className="container m-auto flex py-8 flex-col gap-16">
          <div>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/characters/${characterId}`}>{characterName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>
                  Mask from {kiguName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-col justify-between gap-8 md:gap-0 md:flex-row">
            <div className="w-full flex justify-center md:justify-normal">
              <Image
                  alt="Image"
                  src={maskPic ?? placeholderImg}
                  height={300}
                  width={300}
                  className="h-full max-h-[150px] md:max-h-[200px] w-full max-w-[150px] md:max-w-[200px] rounded-full object-cover"
                ></Image>
            </div>
            
            <div className="flex flex-col gap-8 md:flex-row ">
              <div className="flex flex-col gap-4">
                {!isTabletOrMobile && <span className="text-lg font-medium">Character</span>}
                <Card className="w-full md:w-[300px] p-4 hover:cursor-pointer hover:scale-105 transition hover:shadow-md"
                  onClick={() => {
                    void router.push(`/characters/${characterId}`);
                  }}
                >
                    <div className="flex flex-row gap-8">
                      <Image
                        alt="Image"
                        src={characterPic ?? placeholderImg}
                        height={200}
                        width={200}
                        className="h-full max-h-[100px] w-full max-w-[100px] object-cover"
                      ></Image>
                      <div className="flex flex-col justify-center">
                        <span className="font-bold">{characterName}</span>
                        <span>{originName}</span>
                      </div>
                    </div>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
              {!isTabletOrMobile && <span className="text-lg font-medium">Owner</span>}
                <Card className="w-full md:w-[300px] p-4 hover:cursor-pointer hover:scale-105 transition hover:shadow-md"
                  onClick={() => {
                    void router.push(`/kigus/${kiguId}`);
                  }}
                >
                    <div className="flex flex-row gap-8">
                      <Image
                        alt="Image"
                        src={kigPic ?? placeholderImg}
                        height={200}
                        width={200}
                        className="h-full max-h-[100px] w-full max-w-[100px] object-cover rounded-full"
                      ></Image>
                      <div className="flex flex-col justify-center">
                        <span className="font-bold">{kiguName}</span>
                      </div>
                    </div>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
              {!isTabletOrMobile && <span className="text-lg font-medium">Maker</span>}
                <Card className="w-full md:w-[300px] p-4 hover:cursor-pointer hover:scale-105 transition hover:shadow-md"
                  onClick={() => {
                    void router.push(`/makers/${makerId}`);
                  }}
                >
                    <div className="flex flex-row gap-8">
                      <Image
                        alt="Image"
                        src={makerPic ?? placeholderImg}
                        height={200}
                        width={200}
                        className="h-full max-h-[100px] w-full max-w-[100px] object-cover rounded-full"
                      ></Image>
                      <div className="flex flex-col justify-center">
                        <span className="font-bold">{makerName}</span>
                      </div>
                    </div>
                </Card>
              </div>
            </div>
            
          </div>
          <Separator />
          <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {getGalleryImages()}
            </div>
            <Lightbox
              open={galleryIndex >= 0}
              index={galleryIndex}
              close={() => setGalleryIndex(-1)}
              slides={getSlides()}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Mask;
