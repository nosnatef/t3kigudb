import { useRouter } from "next/router";
import { FC } from "react";

interface NavigationMenuListItemProps {
  title: string,
  content: string,
  link: string
}

const NavigationMenuListItem: FC<NavigationMenuListItemProps> = ({
  title,
  content,
  link
}) => {
  const router = useRouter();

  return (
    <div className="hover:bg-slate-100 rounded-lg p-4 hover:cursor-pointer"
      onClick={() => {void router.push(link)}}
    >
      <div className="text-sm font-medium">
        {title}
      </div>
      <div className="text-sm">
        {content}
      </div>
    </div>
  );
}
 
export default NavigationMenuListItem;