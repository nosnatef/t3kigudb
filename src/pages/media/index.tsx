import { NextPage } from "next";
import Layout from "../layout";
import { ArrowRight } from "lucide-react";
import { api } from "~/utils/api";
import MediaCard from "~/components/MediaPage/MediaCard";

const Media: NextPage = () => {
  const allOrigins = api.origin.getAll.useQuery();

  return (
    <Layout>
      <div className="mx-auto flex max-w-7xl transform flex-col gap-4 px-4 py-4 ">
        <h2 className="text-xl font-bold">Find Character From Media</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {allOrigins.data?.map((origin) => (
            <MediaCard key={origin.id} originData={origin} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Media;
