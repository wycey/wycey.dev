import { identicon } from "@dicebear/collection/async";
import { createAvatar } from "@dicebear/core";

export const getAvatarUrl = async (name: string, url?: string) => {
  if (url) {
    return url;
  }

  return createAvatar(await identicon(), {
    seed: name,
    backgroundColor: ["ffffff00"],
  }).toDataUri();
};
