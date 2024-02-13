import { NextPage } from "next";
import { api } from "~/utils/api";
import Layout from "../layout";
import Image from "next/image";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  const [page, setPage] = useState(1);

  const { data: maskData, isFetching } = api.mask.getUnidentifiedMasks.useQuery({
    limit: 12,
    page
  }, {
    staleTime: Infinity
  });

  const { data: makerData } = api.maker.getAllMakers.useQuery(undefined, {
    staleTime: Infinity
  })

  const { isLoading, mutate } = api.mask.updateMakerForMask.useMutation();

  useEffect(() => {
    if (maskData?.items) {
      setCurrentList(maskData.items);
    }
  }, [maskData?.items])


  return (<>
    <Layout>
      <div className="max-w-5xl mx-auto py-16">
        <h2 className="text-bold text-4xl">
          Mask Identifying
        </h2>
        <Pagination>
              <PaginationContent>
                <PaginationItem onClick={() => {
                  if (page > 1) {
                    setPage((page) => page - 1)
                  }
                }}>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem onClick={() => {
                  setPage((page) => page + 1)
                }}>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="p-1 grid grid-cols-3 gap-2">
            {currentList?.map((mask, index) => (
              
              
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-4">
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
                      <Button className="shadow-sm max-w-[200px]"
                        onClick={() => {
                          mutate({
                            id: mask.id,
                            makerId: currentSelection
                          }, {
                            onSuccess: () =>{
                              setCurrentList(currentList.filter((m) => m.id !== mask.id))
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
              

            ))}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem onClick={() => {
                  if (page > 1) {
                    setPage((page) => page - 1)
                  }
                }}>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem onClick={() => {
                  setPage((page) => page + 1)
                }}>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
      </div>
    </Layout>
  </>)

}

export default Dashboard;