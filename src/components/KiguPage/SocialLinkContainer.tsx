import { SocialLink } from "@prisma/client";
import { useRouter } from "next/router";
import { FC } from "react";
import { TwitterIcon } from "~/assets";

interface SocialLinkContainerProps {
  links: SocialLink[]
}

const socialLinkMapping = {
  "TWITTER": (<TwitterIcon />),
  "REDDIT": (<></>),
  "PERSONAL": (<></>),
  "WEIBO": (<></>)
}

const SocialLinkContainer: FC<SocialLinkContainerProps> = ({ links }) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center">
      {links.map((link) => (<div
        onClick={() => {router.push(link.link)}}
        className="hover:cursor-pointer"
      >
        {socialLinkMapping[link.linkType]}
      </div>))}
    </div>
  );
}
 
export default SocialLinkContainer;