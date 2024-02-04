import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "../layout";
import TitleLoader from "~/components/utils/TitleLoader";
import { placeholderImg } from "~/utils/constant";
import Image from "next/image";
import ProfileInfo from "~/components/InfoPage/ProfileInfo";
import * as Tabs from '@radix-ui/react-tabs'
import PhotoCard from "~/components/PhotoCard";
import { LOADING_TEXT } from "~/constants/strings";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

const Maker: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: makerData } = api.maker.getById.useQuery(Number(id));
  const maskData = makerData?.masks ?? [];

  const { name, picUrl } = makerData ?? {}

  const [galleryIndex, setGalleryIndex] = useState(-1);

  const getSlides = () =>maskData.map((mask) => {
    return {
      src: mask.picUrl
    } as Slide
  })

  return (
      <>
        <Layout>
          <div className="container mx-auto px-3 md:px-0">
            { name ? <h3 className="font-bold text-xl my-4">{ name }</h3> :
              <TitleLoader />
            }
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg py-4">
            <div className="md:w-1/4 flex flex-row md:flex-col justify-around items-center">
              <Image
              alt="Image"
              src={ picUrl ?? placeholderImg}
              height={200}
              width={200}
              className="h-full w-full max-h-[200px] max-w-[200px] object-cover rounded-full"
              >
              </Image>
              <div className="h-[300px] flex flex-col justify-around">
                <ProfileInfo stat={maskData.length ?? 0} desc="Masks made" />
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
                        maskData ? maskData.map((mask) => {
                          return (<PhotoCard 
                            key={mask.id}
                            picSrc={mask.picUrl}
                            title={`${mask.character.name}`}
                            subTitle="Maker"
                            onClick={() => {void router.push(`/characters/${mask.character.id}`)}}
                          />)
                        }) : LOADING_TEXT
                      }
                  </div>
              </Tabs.Content>
              <Tabs.Content value="Gallery"
                className="p-5"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {maskData && maskData.map((mask, index) => (<img
                    key={index}
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
          
        </Layout>
        </>
  )

}

export default Maker;