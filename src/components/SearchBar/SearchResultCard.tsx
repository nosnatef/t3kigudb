interface SearchResultCardProps {
  imgSrc: string | null;
  title: string;
  link: string;
  imgDesc?: string;
  mainContent?: string;
  subContent?: string;
}

import Image from "next/image";
import { useRouter } from "next/router";
import { placeholderImg } from "~/utils/constant";

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  imgSrc,
  imgDesc,
  title,
  mainContent,
  subContent,
  link,
}) => {
  const router = useRouter();

  return (
    <div
      className="h-[150px] w-full max-w-3xl  gap-4 rounded-lg bg-white p-6 hover:cursor-pointer"
      onClick={() => {
        void router.push(link);
      }}
    >
      <div className="flex gap-4">
        <div className="flex min-h-[100px] w-1/4 flex-col gap-4">
          <Image
            alt="Image"
            src={imgSrc ?? placeholderImg}
            width={100}
            height={100}
            className="max-h-[100px] bg-white object-cover"
          />
          <p className="text-gray-200">{imgDesc}</p>
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <h3 className="truncate text-xl font-bold">{title}</h3>
          <p className="text-sm">{mainContent}</p>
          <p className="text-sm font-light">{subContent}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
