import { MakerLink, type SocialLink } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { TwitterIcon } from "~/assets";

interface SocialLinkContainerProps {
  links: SocialLink[] | MakerLink[];
}

const socialLinkMapping = {
  TWITTER: <TwitterIcon />,
  REDDIT: <></>,
  PERSONAL: <></>,
  WEIBO: <></>,
};

const SocialLinkContainer: FC<SocialLinkContainerProps> = ({ links }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center">
      {links.map((link) => (
        <div
          key={link.id}
          onClick={() => {
            void router.push(link.link);
          }}
          className="hover:cursor-pointer"
        >
          {socialLinkMapping[link.linkType]}
        </div>
      ))}
    </div>
  );
};

export default SocialLinkContainer;
