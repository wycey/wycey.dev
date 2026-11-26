import { Avatar, Style } from "@dicebear/core";
import identiconDefinition from "@dicebear/styles/identicon.json" with {
  type: "json",
};

const identiconStyle = new Style(identiconDefinition);

export const getAvatarUrl = async (name: string, url?: string) => {
  if (url) {
    return url;
  }

  return new Avatar(identiconStyle, {
    seed: name,
    backgroundColor: ["ffffff00"],
  }).toDataUri();
};
