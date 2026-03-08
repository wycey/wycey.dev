/** biome-ignore-all lint/suspicious/noArrayIndexKey: Items are static and won't change order */

import { ImageRegistry, type ImageResources } from "@/lib/og/image-registry";
import { processTitle } from "./text";

// Radix Violet / Mauve light mode colors
const colors = {
  // Background
  bgOuter: "#f5f2ff",
  bgCard: "#ffffff",

  // Violet accents
  violet3: "#f0ebff",
  violet4: "#e6deff",
  violet5: "#d7ceff",
  violet9: "#6e56cf",
  violet11: "#5746af",
  violet12: "#20134b",

  // Mauve (neutral)
  mauve9: "#8e8c99",
  mauve11: "#6f6d78",
  mauve12: "#1c1b1f",
} as const;

interface OgImageProps {
  title: string;
  routePath: string;
  images: ImageResources;
}

interface TagInfo {
  name: string;
  slug: string;
}

export interface ArticleOgImageProps extends OgImageProps {
  authorName: string;
  authorId: string;
  categoryName: string;
  categoryId: string;
  tags: TagInfo[];
}

export const createArticleOg = ({
  title,
  authorName,
  authorId,
  categoryName,
  tags,
  images,
}: ArticleOgImageProps) => {
  const titleChunks = processTitle(title);
  const imageRegitry = new ImageRegistry(images);

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${colors.bgOuter} 0%, ${colors.violet3} 100%)`,
        fontFamily: '"Noto Sans JP"',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1120px",
          height: "550px",
          backgroundColor: colors.bgCard,
          borderRadius: "24px",
          padding: "48px 56px",
          boxShadow: "0 4px 24px rgba(110, 86, 207, 0.08)",
          border: `1px solid ${colors.violet4}`,
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: "46px",
            fontWeight: 700,
            color: colors.mauve12,
            lineHeight: 1.55,
            textAlign: "left",
            flexGrow: 1,
            alignContent: "center",
          }}
        >
          {titleChunks.map((chunk, i) => (
            <span key={i} style={{ wordBreak: "keep-all" }}>
              {chunk}
            </span>
          ))}
        </div>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "2px",
            backgroundColor: colors.violet5,
            marginTop: "20px",
            marginBottom: "20px",
            flexShrink: 0,
          }}
        />

        {/* Category & Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: colors.violet9,
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 700,
              padding: "6px 16px",
              borderRadius: "8px",
            }}
          >
            {categoryName}
          </div>

          {/* Tags */}
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag.slug}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
                color: colors.violet11,
                backgroundColor: colors.violet3,
                padding: "4px 12px",
                borderRadius: "6px",
                gap: "2px",
              }}
            >
              <span style={{ fontSize: "16px", opacity: 0.7 }}>#</span>
              {tag.name}
            </div>
          ))}
        </div>

        {/* Bottom: Author + Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* Author */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {imageRegitry.has(authorId) ? (
              <img
                src={imageRegitry.getBase64(authorId)}
                alt=""
                width={40}
                height={40}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: colors.violet4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.violet9,
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {authorName[0]}
              </div>
            )}
            <span
              style={{
                fontSize: "22px",
                fontWeight: 400,
                color: colors.mauve11,
              }}
            >
              {authorName}
            </span>
          </div>

          {/* Logo */}
          <img
            src={imageRegitry.getBase64("logoLight")}
            alt=""
            height={40}
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export interface PerPageOgImageProps extends OgImageProps {
  description: string;
}

export const createPerPageOg = (props: PerPageOgImageProps) => {
  return null;
};
