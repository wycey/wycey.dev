import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

const CONSTANTS_MAPPING: { [key: string]: string } = {
  SITE_URL: SITE_URL,
  SITE_NAME: SITE_NAME,
  SITE_DESCRIPTION: SITE_DESCRIPTION,
};

export const replacePlaceholder = (text: string) =>
  text.replace(
    /{{\s*([A-Z_]+)\s*}}/g,
    (_, key: string) => CONSTANTS_MAPPING[key] || `{{${key}}}`,
  );
