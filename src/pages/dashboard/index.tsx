/* eslint-disable */

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
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Mask } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard: NextPage = () => {
  const [jsonObject, setJsonObject] = useState({});

  const { data: logData } = api.origin.getOriginIngestionLogs.useQuery(
    undefined,
    {
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    try {
      if (logData && logData.length > 0) {
        // const parsed = JSON.parse(logData[0][0]?.ingestionlogs);
        // setJsonObject(parsed);
      }
    } catch (error) {
      console.error("Error parsing JSON", error);
      setJsonObject({});
    }
  }, [logData]);

  const getLogAccordions = (json: any) => {
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        const value = json[key];
        console.log(`${key}: ${value}`);
      }
    }
  };

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-5xl py-16">
          <Tabs defaultValue="log" className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="log">Log</TabsTrigger>
            </TabsList>
            <TabsContent value="log">
              <Tabs defaultValue="Arknights">
                <TabsList>
                  {logData?.map((origin) => {
                    return (
                      <TabsTrigger key={origin.id} value={origin.name}>
                        {origin.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {logData?.map((origin) => {
                  return (
                    <TabsContent key={origin.id} value={origin.name}>
                      <span>{origin.name}</span>
                      <div>
                        {origin.ingestionlogs.map((log) => {
                          return (
                            <Accordion key={log.id} type="single" collapsible>
                              <pre>
                                {Object.keys(JSON.parse(log.log)).map(
                                  (key, index) => {
                                    if (
                                      JSON.parse(log.log).hasOwnProperty(key)
                                    ) {
                                      const value = JSON.parse(log.log)[key];
                                      console.log(value);
                                      return (
                                        <AccordionItem value={key} key={index}>
                                          <AccordionTrigger>
                                            {key}
                                          </AccordionTrigger>
                                          <AccordionContent className="">
                                            {value.map((item) => (
                                              <div>{item}</div>
                                            ))}
                                          </AccordionContent>
                                        </AccordionItem>
                                      );
                                    }
                                  }
                                )}
                              </pre>
                            </Accordion>
                          );
                        })}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
