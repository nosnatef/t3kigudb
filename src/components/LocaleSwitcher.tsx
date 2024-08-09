import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
  } from "~/components/MenuBar/NavigationMenu";

const LocaleSwitcher = () => {
  const { locale, asPath } = useRouter();

  return (
    <>
      <NavigationMenuItem>
          <Link href={asPath} locale='zh' legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              中文
          </NavigationMenuLink>
          </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
          <Link href={asPath} locale='ja' legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              日本語
          </NavigationMenuLink>
          </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
          <Link href={asPath} locale='en' legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              English
          </NavigationMenuLink>
          </Link>
      </NavigationMenuItem>
    </>
  );
};

export default LocaleSwitcher;