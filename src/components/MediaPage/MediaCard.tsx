import { type Origin } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { type FC } from "react";

interface Props {
  originData: Origin;
}

const MediaCard: FC<Props> = ({ originData }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => void router.push(`/media/${originData.id}`)}
      className="flex w-full flex-row justify-between gap-2 rounded-md bg-white px-4 py-2 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="truncate font-bold">{originData.name}</div>
        <div className="font-light">{originData.type}</div>
      </div>
      <div className="flex items-center">
        <ArrowRight />
      </div>
    </div>
  );
};

export default MediaCard;
