import { api } from "~/utils/api";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

import * as Tabs from '@radix-ui/react-tabs'

import Image from "next/image";
import { placeholderImg } from "~/utils/constant";
import { useState } from "react";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ProfileInfo from "~/components/InfoPage/ProfileInfo";
import PhotoCardLoader from "~/components/PhotoCardLoader";

const Character: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: characterData } = api.character.getById.useQuery(id);
  const maskData = characterData?.masks ?? [];

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const getSlides = (): Slide[] => {
    const slides: Slide[][] | undefined = characterData?.masks?.map((mask) => {
      return mask.maskPics.map((pic) => {
        return {
          src: pic.link
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
          console.log(i)
          return (<img
            key={key}
            src={pic.link}
            className="rounded-lg h-full w-full max-h-[200px] max-w-[200px] object-cover hover:cursor-pointer hover:shadow-lg hover:sclae-105 transition"
            onClick={() => setGalleryIndex(key)}
          ></img>)
      })})
    }
    return "";
  }

  return (
    <>
      <Layout>
      <div className="container mx-auto px-3 md:px-0">
        <h3 className="font-bold text-xl my-4">{ characterData?.name }</h3>
        <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg py-4">
          <div className="md:w-1/4 flex flex-row md:flex-col justify-around items-center md:max-h-[80vh]">
            <Image
            alt="Image"
            src={ characterData?.picUrl ?? placeholderImg}
            height={300}
            width={300}
            className="h-full w-full max-h-[200px] max-w-[200px] object-cover rounded-full"
            >
            </Image>
            <div className="h-[300px] flex flex-col justify-around">
              <ProfileInfo stat={characterData?.origin?.name ?? "N/A"} desc="From" />
              <ProfileInfo stat={characterData?.origin?.type ?? "N/A"} desc="Media Type" />
              <ProfileInfo stat={characterData?.masks?.length ?? 0} desc="Masks Made" />
            </div>
          </div>
          <div className="md:w-3/4">
          <Tabs.Root defaultValue="Masks"
            className="flex flex-col min-h-[500px]"
          >
            <Tabs.List
              className="shrink-0 border-b"
            >
              <Tabs.Trigger
                className="px-5 h-[45px] data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                value="Masks"
              >
                Masks
              </Tabs.Trigger>
              <Tabs.Trigger
                className="px-5 h-[45px] data-[state=active]:text-sky-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]"
                value="Gallery"
              >
                Gallery
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="Masks"
              className="p-5"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {
                      maskData.length > 0 ? maskData.map((mask) => {
                        return (<PhotoCard 
                          key={mask.id}
                          picSrc={mask.picUrl}
                          title={`${mask.kigu.name}`}
                          subTitle="Maker"
                          onClick={() => {void router.push(`/kigus/${mask.kigu.id}`)}}
                        />)
                      }) : Array(12).fill(<PhotoCardLoader />)
                    }
                </div>
            </Tabs.Content>
            <Tabs.Content value="Gallery"
              className="p-5"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
  )
}

export default Character;