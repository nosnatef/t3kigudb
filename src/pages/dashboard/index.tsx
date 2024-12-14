/* eslint-disable */

import { NextPage } from "next";
import { api } from "~/utils/api";
import Layout from "../layout";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: NextPage = () => {
  const { data: logData } = api.origin.getOriginIngestionLogs.useQuery(
    undefined,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

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
                                            {value.map(
                                              (
                                                item:
                                                  | string
                                                  | number
                                                  | boolean
                                                  | ReactElement<
                                                      any,
                                                      | string
                                                      | JSXElementConstructor<any>
                                                    >
                                                  | ReactFragment
                                                  | ReactPortal
                                                  | PromiseLikeOfReactNode
                                                  | null
                                                  | undefined
                                              ) => (
                                                <div>{item}</div>
                                              )
                                            )}
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
