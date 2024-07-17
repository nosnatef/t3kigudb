/* eslint-disable */
import { NextPage } from "next";
import Layout from "../layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
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
import { useUser } from "@clerk/clerk-react";
import { Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Mask: NextPage = () => {
  const { isSignedIn } = useUser();

  const router = useRouter();
  const id = router.query.id as string;

  const { data: maskData, refetch: maskDataRefetch } =
    api.mask.getById.useQuery(id);

  const {
    character,
    maskPics,
    picUrl: maskPic,
    maker,
    id: maskId,
  } = maskData ?? {};
  const { kigu } = maskData ?? {};
  const { picUrl: makerPic, name: makerName, id: makerId } = maker ?? {};
  const {
    name: characterName,
    id: characterId,
    picUrl: characterPic,
    origin,
  } = character ?? {};
  const { name: originName } = origin ?? {};
  const { name: kiguName, picUrl: kigPic, id: kiguId } = kigu ?? {};

  const [galleryIndex, setGalleryIndex] = useState(-1);
  const [isMaskEdit, setIsMaskEdit] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(-1);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { data: makerData } = api.maker.getAllMakers.useQuery(undefined, {
    staleTime: Infinity,
  });

  const { isLoading, mutate } = api.mask.updateMakerForMask.useMutation();
  const { mutate: mutateDelete } = api.mask.deleteById.useMutation();

  const getSlides = (): Slide[] => {
    if (maskPics) {
      return maskPics.map((pic) => {
        return {
          src: pic.link,
        } as Slide;
      });
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
            className="h-full max-h-[300px] w-full max-w-[300px] rounded-lg object-cover transition hover:scale-105 hover:cursor-pointer hover:shadow-lg"
            onClick={() => setGalleryIndex(key)}
          ></img>
        );
      });
    }
    return "";
  }, [maskPics]);

  return (
    <>
      <Layout>
        <div className="container m-auto flex flex-col gap-16 py-8">
          <div>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/characters/${characterId}`}>
                  {characterName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Mask from {kiguName}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            {isSignedIn ? <Badge variant="destructive">Admin Mode</Badge> : ""}
            {maskData && isSignedIn && (
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
                        mutateDelete(id);
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
          </div>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-0">
            <div className="flex w-full justify-center md:justify-normal">
              <Image
                alt="Image"
                src={maskPic ?? placeholderImg}
                height={300}
                width={300}
                className="h-full max-h-[150px] w-full max-w-[150px] rounded-full object-cover md:max-h-[200px] md:max-w-[200px]"
              ></Image>
            </div>

            <div className="flex flex-col gap-8 md:flex-row ">
              <div className="flex flex-col gap-4">
                {!isTabletOrMobile && (
                  <span className="text-lg font-medium">Character</span>
                )}
                <Card
                  className="w-full p-4 transition hover:cursor-pointer hover:shadow-md md:w-[300px]"
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
                {!isTabletOrMobile && (
                  <span className="text-lg font-medium">Owner</span>
                )}
                <Card
                  className="w-full p-4 transition hover:cursor-pointer hover:shadow-md md:w-[300px]"
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
                      className="h-full max-h-[100px] w-full max-w-[100px] rounded-full object-cover"
                    ></Image>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold">{kiguName}</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
                {!isTabletOrMobile && (
                  <span className="text-lg font-medium">Maker</span>
                )}
                <Card
                  className="w-full p-4 transition hover:cursor-pointer hover:shadow-md md:w-[300px]"
                  onClick={(e) => {
                    if (isSignedIn && e.currentTarget !== e.target) {
                      return;
                    }
                    void router.push(`/makers/${makerId}`);
                  }}
                >
                  <div className="relative flex flex-row gap-8">
                    <div className="absolute right-0 top-0">
                      {isSignedIn &&
                        (!isMaskEdit ? (
                          <Edit
                            className="hover:scale-110 hover:text-slate-500"
                            onClick={(e) => {
                              console.log(e.target);
                              setIsMaskEdit(true);
                            }}
                          />
                        ) : (
                          <div className="flex flex-row">
                            <Check
                              className="hover:scale-110 hover:text-slate-500"
                              onClick={() => {
                                if (maskId) {
                                  mutate(
                                    {
                                      id: maskId,
                                      makerId: currentSelection,
                                    },
                                    {
                                      onSuccess: () => {
                                        maskDataRefetch();
                                        setIsMaskEdit(false);
                                      },
                                    }
                                  );
                                }
                              }}
                            />
                            <X
                              className="hover:scale-110 hover:text-slate-500"
                              onClick={() => {
                                setIsMaskEdit(false);
                              }}
                            />
                          </div>
                        ))}
                    </div>
                    {isMaskEdit ? (
                      <Select
                        onValueChange={(value) => {
                          const makerId = parseInt(value);
                          setCurrentSelection(makerId);
                        }}
                        value={currentSelection.toString()}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a maker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {makerData?.map((maker, index) => (
                              <SelectItem
                                value={maker.id.toString()}
                                key={index.toString()}
                              >
                                {maker.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <Image
                          alt="Image"
                          src={makerPic ?? placeholderImg}
                          height={200}
                          width={200}
                          className="h-full max-h-[100px] w-full max-w-[100px] rounded-full object-cover"
                          onClick={() => {
                            void router.push(`/makers/${makerId}`);
                          }}
                        ></Image>
                        <div
                          className="flex flex-col justify-center"
                          onClick={() => {
                            void router.push(`/makers/${makerId}`);
                          }}
                        >
                          <span className="font-bold">{makerName}</span>
                        </div>
                      </>
                    )}
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
  );
};

export default Mask;
