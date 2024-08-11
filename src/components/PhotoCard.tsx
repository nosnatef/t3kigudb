import { type MouseEventHandler } from "react";

import Image from "next/image";

interface PhotoCardProps {
  key: string;
  picSrc: string | null;
  title: string;
  subTitle?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  key,
  picSrc,
  title,
  subTitle,
  onClick,
}) => {
  const placeholderImg = "https://placehold.co/400x400?text=Unknown";

  return (
    <>
      <div
        key={key}
        className="relative h-48 overflow-hidden rounded-lg bg-white shadow-md hover:cursor-pointer"
        onClick={onClick}
      >
        <Image
          alt="Image"
          src={picSrc ?? placeholderImg}
          width={500}
          height={500}
          className={`h-full max-h-[200px] w-full max-w-[200px] object-cover`}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 px-6 py-2 hover:bg-opacity-70">
          <h3 className="mb-2 truncate text-lg font-medium text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-300">{subTitle}</p>
        </div>
      </div>
    </>
  );
};

export default PhotoCard;
