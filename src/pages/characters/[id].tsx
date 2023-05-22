import { api } from "~/utils/api";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../layout";
import PhotoCard from "~/components/PhotoCard";

import * as Tabs from '@radix-ui/react-tabs'

import Image from "next/image";
import { placeholderImg } from "~/utils/constant";
import { useMemo, useState } from "react";

import Lightbox, { Slide } from "yet-another-react-lightbox";
import PhotoAlbum, { Photo } from "react-photo-album";
import "yet-another-react-lightbox/styles.css";

const Character: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: maskData } = api.mask.getByCharacterId.useQuery(id);
  const { data: characterData } = api.character.getById.useQuery(id);

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const getSlides = () => maskData?.map((mask) => {
    return {
      src: mask.picUrl
    } as Slide
  })

  return (
    <>
      <Layout>
      <div className="container mx-auto px-3 md:px-0">
        <h3 className="font-bold text-xl my-4">{ characterData?.name }</h3>
        <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg py-4">
          <div className="md:w-1/3">
            <Image
            alt="Image"
            src={ characterData?.picUrl ?? placeholderImg}
            height={300}
            width={300}
            className="h-full w-full max-h-[300px] max-w-[300px] object-cover"
            >
            </Image>
            
          </div>
          <div className="md:w-2/3">
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
              <div className="flex flex-row items-center justify-center m-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {
                      maskData ? maskData.map((mask) => {
                        return (<PhotoCard 
                          key={mask.id}
                          picSrc={mask.picUrl}
                          title={`${mask.kigu.name}`}
                          subTitle="Maker"
                        />)
                      }) : "Loading"
                    }
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="Gallery"
              className="p-5"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {maskData && maskData.map((mask, index) => (<img
                  src={mask.picUrl}
                  className="rounded-lg h-full w-full max-h-[200px] max-w-[200px] object-cover hover:cursor-pointer hover:shadow-lg hover:sclae-105 transition"
                  onClick={() => setGalleryIndex(index)}
                ></img>))}
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
      
      {/* <div className="container relative flex flex-col md:flex-row mx-4 md:mx-auto my-6 gap-4">
        <div className="">
          <h3 className="font-bold text-xl">{ characterData?.name }</h3>
        </div>
        
        <div className="flex flex-row items-center justify-center m-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {
                maskData ? maskData.map((mask) => {
                  return (<PhotoCard 
                    key={mask.id}
                    picSrc={mask.picUrl}
                    title={`${mask.kigu.name}`}
                    subTitle="Maker"
                  />)
                }) : "Loading"
              }
          </div>
        </div>
      </div> */}
      
      </Layout>
    </>
  )
}

export default Character;