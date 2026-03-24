import type { PropsWithChildren } from "react";

interface SearchResultCardProps {
  url: string;
  title: string;
  excerpt: string;
  category: string | undefined;
  tags: string[];
  author: string | undefined;
  avatar: string | undefined;
  publishedAt: string | undefined;
  wordCount: number;
}

const IconChip = ({ icon, children }: PropsWithChildren<{ icon: string }>) => (
  <div flex items="center" gap="1.5">
    <span p="1" bg="primary-bg" rounded="1.5">
      <span block text="xs primary-fg-solid" className={icon} />
    </span>
    {children}
  </div>
);

export const SearchResultCard = ({
  url,
  title,
  excerpt,
  category,
  tags,
  author,
  avatar,
  publishedAt,
  wordCount,
}: SearchResultCardProps) => {
  return (
    <a
      href={url}
      data-astro-prefetch="viewport"
      grid
      rounded="2"
      p="5"
      bg="hover:bg-subtle/50%"
      border="1 border-subtle"
      transition="all 200"
      text="inherit"
      gap-y="2"
      row-span="4"
      grid-rows="subgrid"
      className="group no-underline"
    >
      <div flex items="start" gap="2">
        <h3
          flex-auto
          min-w="0"
          text="lg"
          font="bold"
          transition="colors 200"
          group-hover="text-primary-fg-solid"
          line-clamp="2"
          style={{
            fontKerning: "normal",
            fontVariantEastAsian: "proportional-width",
            textWrap: "balance",
            wordBreak: "auto-phrase",
          }}
        >
          {title}
        </h3>
        <span
          block
          text="lg primary-fg-solid"
          shrink="0"
          mt="1"
          transition="all 200"
          group-hover="opacity-100 translate-x-1"
          className="i-lucide:chevron-right opacity-0"
        />
      </div>

      <div flex items="center" gap="2.5" flex-wrap="wrap">
        {category && (
          <span
            text="xs"
            font="medium"
            bg="primary-bg"
            rounded="2"
            px="2"
            py="0.5"
            className="text-primary-fg-solid whitespace-nowrap"
          >
            {category}
          </span>
        )}
        {tags.length > 0 && (
          <>
            <div w="px" h="3.5" bg="border" rounded="full" shrink="0" />
            <div flex items="center" gap="1.5" flex-wrap="wrap" min-w="0">
              {tags.map((tag) => (
                <span
                  key={tag}
                  text="xs fg-muted"
                  border="1 border-subtle"
                  rounded="1.5"
                  px="1.5"
                  py="0.5"
                  className="whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        text="sm fg-muted"
        className="leading-relaxed [&_mark]:bg-secondary-bg [&_mark]:text-secondary-fg-solid [&_mark]:rounded-0.5 [&_mark]:px-0.5"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: pagefind excerpt contains <mark> tags for highlighting
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />

      <div
        flex
        items="center"
        gap="3"
        flex-wrap="wrap"
        text="fg-muted"
        className="self-end"
      >
        {author && (
          <div flex items="center" gap="1.5">
            <img
              src={avatar}
              alt={`${author} のアバター画像`}
              width={20}
              height={20}
              w="5"
              h="5"
              rounded="full"
              shrink="0"
              loading="lazy"
              decoding="async"
              className="object-cover"
            />
            <span text="xs">{author}</span>
          </div>
        )}
        <IconChip icon="i-lucide:calendar">
          <time dateTime={publishedAt} text="xs">
            {publishedAt}
          </time>
        </IconChip>
        <IconChip icon="i-lucide:text">
          <span text="xs">{wordCount}字</span>
        </IconChip>
      </div>
    </a>
  );
};
