import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { loadFonts } from "./font";
import { createOgImage, type OgImageProps } from "./image";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export const renderOgImage = async (
  props: OgImageProps,
): Promise<Uint8Array> => {
  const fonts = await loadFonts();
  const element = createOgImage(props);

  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: fonts.map((font) => ({
      name: font.name,
      data: font.data,
      weight: font.weight,
      style: font.style,
    })),
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OG_WIDTH,
    },
  });

  const pngData = resvg.render();

  return pngData.asPng();
};
