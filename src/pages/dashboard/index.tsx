import { NextPage } from "next";
import { api } from "~/utils/api";
import Layout from "../layout";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Mask } from "@prisma/client";

const Dashboard: NextPage = () => {

  const [currentSelection, setCurrentSelection] = useState(-1);
  const [currentList, setCurrentList] = useState<Mask[]>([]);

  const { data: maskData, isFetching } = api.mask.getUnidentifiedMasks.useQuery(undefined, {
    staleTime: Infinity
  });

  const { data: makerData } = api.maker.getAllMakers.useQuery(undefined, {
    staleTime: Infinity
  })

  const { isLoading, mutate } = api.mask.updateMakerForMask.useMutation();

  useEffect(() => {
    if (maskData) {
      setCurrentList(maskData);
    }
  }, [maskData])


  return (<>
    <Layout>
      <div className="max-w-5xl mx-auto py-16">
        <h2 className="text-bold text-4xl">
          Mask Identifying
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {maskData?.map((mask, index) => (
              <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col">
                    <Image
                        alt="Image"
                        src={mask.picUrl}
                        width={300}
                        height={300}
                        className={`max-h-[500px] max-w-[500px]`}
                      />
                      <Select
                        onValueChange={(value) => {
                          const makerId = parseInt(value);
                          setCurrentSelection(makerId);
                          
                          
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a maker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {makerData?.map((maker, index) => (
                              <SelectItem value={maker.id.toString()}
                                key={index.toString()}
                              
                              >{maker.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button className="bg-[#F9F1F8] shadow-sm max-w-[200px]"
                        onClick={() => {
                          mutate({
                            id: mask.id,
                            makerId: currentSelection
                          }, {
                            onSuccess: () =>{
                              setCurrentList(currentList.filter((m) => m.id === mask.id))
                              alert("identification action success")
                            } 
                          })
                        }}
                        disabled={isLoading}
                      >
                        Update
                      </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
      </Carousel>
      </div>
    </Layout>
  </>)

}

export default Dashboard;