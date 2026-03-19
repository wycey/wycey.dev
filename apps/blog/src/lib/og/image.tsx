/** biome-ignore-all lint/suspicious/noArrayIndexKey: Items are static and won't change order */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: OG images are not used in HTML context */

import type { PropsWithChildren } from "react";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { ImageRegistry, type ImageResources } from "@/lib/og/image-registry";
import { processTitle } from "./text";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const colors = {
  // primary: violet
  // base: mauve

  light: {
    primary1: "#fcfcfe",
    primary3: "#f3f0ff",
    primary7: "#c4b2fe",
    primary10: "#9a7fe0",

    base1: "#fdfcfd",
    base3: "#f2eff3",
    base5: "#e3dfe6",
    base6: "#dbd8e0",
    base7: "#d0cdd7",
    base8: "#bcbac7",
    base9: "#8e8c99",
    base11: "#65636d",
    base12: "#211f26",
  },
  dark: {
    base1: "#121113",
    base5: "#323035",
    base7: "#49474e",
    base8: "#625f69",
    base10: "#7c7a85",
    base11: "#b5b2bc",
    base12: "#eeeef0",
  },
} as const;

const TagItem = ({ children }: PropsWithChildren) => (
  <div
    style={{
      height: "100%",
      padding: "4px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${colors.light.base7}`,
      borderRadius: "8px",
    }}
  >
    {children}
  </div>
);

interface OgImageProps {
  images: ImageResources;
}

interface TagInfo {
  name: string;
  slug: string;
}

export interface ArticleOgImageProps extends OgImageProps {
  title: string;
  routePath: string;
  articleId: string;
  authorName: string;
  authorId: string;
  categoryName: string;
  categoryId: string;
  publishedAt: string;
  words: number;
  tags: TagInfo[];
}

export const createArticleOg = async ({
  title,
  routePath,
  articleId,
  authorId,
  authorName,
  categoryId,
  categoryName,
  publishedAt,
  words,
  tags,
  images,
}: ArticleOgImageProps) => {
  const titleChunks = processTitle(title);
  const imageRegistry = new ImageRegistry(images);

  return (
    <div
      style={{
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        display: "flex",
        color: colors.light.base12,
        backgroundColor: colors.light.primary1,
        fontFamily: '"Noto Sans JP"',
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "64px 48px 32px 48px",
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Page Type (Blog) */}
        <div
          style={{
            width: "100%",
            height: "32px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            color: colors.light.base8,
            fontFamily: '"Inter Tabular Numbers"',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-pen-line-icon lucide-pen-line"
          >
            <path d="M13 21h8" />
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          </svg>
          <p style={{ fontSize: "20px" }}>Blog</p>
        </div>
        {/* Article Title */}
        <div
          style={{
            display: "block",
            flexShrink: 1,
            minHeight: "0",
            wordBreak: "break-word",
            fontSize: "48px",
            lineHeight: "1.4",
            fontWeight: 700,
            textOverflow: "ellipsis",
            lineClamp: "4",
          }}
        >
          {titleChunks.join("\u200b")}
        </div>
        {/* Spacer */}
        <div style={{ flexGrow: "1" }} />
        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Page Path */}
          <div
            style={{
              color: colors.light.base7,
            }}
          >
            {routePath}
          </div>
          {/* Separator */}
          <div
            style={{
              width: "100%",
              marginTop: "16px",
              height: "1px",
              backgroundColor: colors.light.base6,
            }}
          />
          {/* Categories & Tags */}
          <div
            style={{
              width: "100%",
              marginTop: "32px",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            {/* Category Badge */}
            <div
              style={{
                padding: "4px 16px",
                color: colors.light.primary10,
                backgroundColor: colors.light.primary3,
                borderRadius: "8px",
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {categoryName}
            </div>
            {/* Vertical Separator */}
            <div
              style={{
                width: "1px",
                height: "80%",
                backgroundColor: colors.light.base6,
              }}
            />
            {/* Tags */}
            <div
              style={{
                height: "100%",
                flex: "1",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: colors.light.base9,
                textAlign: "center",
              }}
            >
              {tags.slice(0, 2).map((tag) => (
                <TagItem key={tag.slug}>{`#${tag.name}`}</TagItem>
              ))}
              {/* Tags Overflow Ellipsis */}
              {tags.length > 2 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-ellipsis-icon lucide-ellipsis"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              )}
            </div>
          </div>
          {/* Author & Metadata */}
          <div
            style={{
              marginTop: "24px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src={await imageRegistry.getBase64(`avatar-${authorId}`)}
              alt=""
              width={48}
              height={48}
              style={{
                backgroundColor: colors.light.base7,
                borderRadius: "100%",
              }}
            />
            <div
              style={{
                marginLeft: "8px",
                color: colors.light.base11,
                display: "block",
                fontSize: "20px",
                textOverflow: "ellipsis",
                lineClamp: 1,
              }}
            >
              {authorName}
            </div>
            {/* Spacer */}
            <div style={{ flexGrow: 1 }} />
            {/* Metadata */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "20px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.light.primary3,
                  color: colors.light.primary10,
                  borderRadius: "8px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-text-align-start-icon lucide-text-align-start"
                >
                  <path d="M21 5H3" />
                  <path d="M15 12H3" />
                  <path d="M17 19H3" />
                </svg>
              </div>
              <div
                style={{
                  marginRight: "8px",
                }}
              >
                {`${words}字`}
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.light.primary3,
                  color: colors.light.primary10,
                  borderRadius: "8px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-calendar-icon lucide-calendar"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <div
                style={{
                  marginRight: "8px",
                  fontFamily: '"Inter Tabular Numbers"',
                }}
              >
                {publishedAt}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "16px",
          height: "100%",
          backgroundColor: colors.light.primary7,
          marginRight: "16px",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexBasis: "38.2%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",

          ...(imageRegistry.has(`cover-${articleId}`)
            ? {
                alignItems: "flex-end",
                justifyContent: "flex-end",
                backgroundImage: `url(${await imageRegistry.getBase64(`cover-${categoryId}-${articleId}`)})`,
              }
            : {
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${await imageRegistry.getBase64("ogGradient")})`,
              }),
        }}
      >
        {imageRegistry.has(`cover-${articleId}`) ? (
          <div
            style={{
              position: "relative",
              width: "200px",
              height: "70px",
              padding: "16px 32px",
              marginRight: "32px",
              marginBottom: "32px",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: colors.light.base7,
                opacity: "0.75",
                borderRadius: "8px",
              }}
            />
            <img
              src={await imageRegistry.getBase64("logoLight")}
              alt=""
              width={150}
              height={40}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "140px",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: colors.light.base5,
                opacity: "0.2",
              }}
            />
            <img
              src={await imageRegistry.getBase64("logoDark")}
              alt=""
              width={300}
              height={80}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export interface PerPageOgImageProps extends OgImageProps {
  title: string;
  routePath: string;
  description: string;
}

export const createPerPageOg = async ({
  title,
  routePath,
  description,
  images,
}: PerPageOgImageProps) => {
  const titleChunks = processTitle(title);
  const imageRegistry = new ImageRegistry(images);

  return (
    <div
      style={{
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        display: "flex",
        color: colors.dark.base12,
        backgroundColor: colors.dark.base1,
        fontFamily: '"Noto Sans JP"',
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "64px 96px 24px 96px",
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Page Title */}
        <div
          style={{
            display: "block",
            wordBreak: "break-word",
            fontSize: "48px",
            fontWeight: 700,
            textAlign: "center",
            textOverflow: "ellipsis",
            lineClamp: "3",
          }}
        >
          {titleChunks.join("\u200b")}
        </div>
        {/* Separator */}
        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundColor: colors.dark.base7,
          }}
        />
        {/* Page Description */}
        <div
          style={{
            marginLeft: "24px",
            marginRight: "24px",
            display: "block",
            color: colors.dark.base11,
            wordBreak: "break-word",
            fontSize: "26px",
            textAlign: "center",
            textOverflow: "ellipsis",
            lineClamp: "3",
          }}
        >
          {description}
        </div>
        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />
        {/* Bottom Section */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src={await imageRegistry.getBase64("logoDark")}
            alt=""
            width={260}
            height={69}
          />
          <div
            style={{
              display: "block",
              color: colors.dark.base8,
              wordBreak: "break-word",
              fontSize: "16px",
              textAlign: "center",
              textOverflow: "ellipsis",
              lineClamp: "1",
            }}
          >
            {routePath}
          </div>
          <div
            style={{
              display: "block",
              color: colors.dark.base10,
              wordBreak: "break-word",
              fontSize: "20px",
              textAlign: "center",
              textOverflow: "ellipsis",
              lineClamp: "1",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    </div>
  );
};

export const createDefaultOg = async ({ images }: OgImageProps) => {
  const imageRegistry = new ImageRegistry(images);

  return (
    <div
      style={{
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        color: colors.dark.base12,
        backgroundColor: colors.dark.base1,
        fontFamily: '"Noto Sans JP"',
      }}
    >
      <img
        src={await imageRegistry.getBase64("logoDark")}
        alt=""
        width={448}
        height={120}
      />
      <div
        style={{
          display: "block",
          color: colors.dark.base10,
          wordBreak: "break-word",
          fontSize: "20px",
          textAlign: "center",
          textOverflow: "ellipsis",
          lineClamp: "1",
        }}
      >
        {SITE_DESCRIPTION}
      </div>
    </div>
  );
};
