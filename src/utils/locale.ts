import { Character, Origin } from "@prisma/client";

export const getLocaleName = (entry: Character | Origin, locale: string) => {
  if (locale == "ja" && !!entry.name_jp) {
    return entry.name_jp;
  } else if (locale == "zh" && !!entry.name_zh) {
    return entry.name_zh;
  }
  return entry.name;
};
