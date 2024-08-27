import { Character } from "@prisma/client";

export const getCharacterLocaleName = (
  character: Character,
  locale: string
) => {
  if (locale == "ja" && !!character.name_jp) {
    return character.name_jp;
  } else if (locale == "zh" && !!character.name_zh) {
    return character.name_zh;
  }
  return character.name;
};
