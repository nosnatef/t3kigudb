import { useEffect, useState, forwardRef } from 'react';
import { useRouter } from 'next/router';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LocaleSwitcher = () => {
  const { locale, asPath } = useRouter();
  const [language, setLanguage] = useState(locale);
  const router = useRouter();
  const changeLocale = (locale: string) => {
    router.push(asPath, asPath, { locale });
  }

  return (
    <>
      <Select onValueChange={(value)=>changeLocale(value)}>
        <SelectTrigger className={"w-[180px]"}>
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
          <SelectItem value="ja">日本語</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
};

export default LocaleSwitcher;