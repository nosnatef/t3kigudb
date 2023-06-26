interface SearchResultCardProps {
  imgSrc: string | null,
  title: string,
  link: string
  imgDesc?: string,
  mainContent?: string,
  subContent?: string,
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
  link
}) => {
  const router = useRouter();

  return ( 
    <div className="w-full max-w-3xl min-h-[150px] rounded-lg bg-white p-6 gap-4 hover:cursor-pointer"
      onClick={() => {void router.push(link)}}
    >
      <div className="flex gap-4">
        <div className="w-1/4 min-h-[100px] flex flex-col gap-4">
          <Image
            alt="Image"
            src={imgSrc ?? placeholderImg}
            width={100}
            height={100}
            className="bg-white max-h-[100px] object-cover"
          />
          <p className="text-gray-200">{imgDesc}</p>
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p
            className="text-gray-300"
          >
            {mainContent}
          </p>
          <p className="text-gray-300">
            {subContent}
          </p>
        </div>
      </div>
    </div>
  );
}
 
export default SearchResultCard;