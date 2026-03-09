import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import satori from "satori";
import { OG_HEIGHT, OG_WIDTH } from "./image";

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

export const renderOgImage = async (
  element: ReactNode,
  fonts: FontData[],
): Promise<Buffer> => {
  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    embedFont: true,
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
