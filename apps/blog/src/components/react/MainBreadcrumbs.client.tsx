import type { MarkdownHeading } from "astro";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BreadcrumbDropdownItem,
  type DropdownMenuItemDef,
} from "./BreadcrumbDropdownItem.client";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Category {
  id: string;
  name: string;
  articleCount: number;
}

export interface BreadcrumbEntry {
  name: string;
  href: string;
}

export interface MainBreadcrumbsProps {
  children?: ReactNode;
  currentPath: string;
  authors?: Author[];
  categories?: Category[];
  headings?: MarkdownHeading[];
  breadcrumbs?: BreadcrumbEntry[];
}

const resolveBlogTriggerLabel = (
  currentPath: string,
  authors: Author[],
): string => {
  if (currentPath === "/articles") return "Archive";

  if (
    currentPath === "/" ||
    currentPath.match(/^\/\d+\/?$/) ||
    currentPath.startsWith("/articles/")
  )
    return "Blog";

  if (currentPath.startsWith("/about")) return "About";

  const authorMatch = currentPath.match(/^\/@(.+?)(?:\/|$)/);

  if (authorMatch) {
    const author = authors.find((a) => a.id === authorMatch[1]);

    if (author) return author.name;
  }

  return "Blog";
};

const resolveBlogTriggerIcon = (
  currentPath: string,
  authors: Author[],
): ReactNode => {
  if (currentPath === "/articles")
    return <span block size="4" shrink="0" className="i-lucide:archive" />;

  if (currentPath.startsWith("/about"))
    return <span block size="4" shrink="0" className="i-lucide:info" />;

  const authorMatch = currentPath.match(/^\/@(.+?)(?:\/|$)/);

  if (authorMatch) {
    const author = authors.find((a) => a.id === authorMatch[1]);

    if (author?.avatar) {
      return (
        <img
          src={author.avatar}
          alt=""
          width={16}
          height={16}
          className="size-4 rounded-full object-contain shrink-0"
        />
      );
    }

    return <span block size="4" shrink="0" className="i-lucide:user" />;
  }

  return <span block size="4" shrink="0" className="i-lucide:pen-line" />;
};

const buildBlogMenuItems = (
  currentPath: string,
  authors: Author[],
): DropdownMenuItemDef[] => {
  const isHome = currentPath === "/";
  const isArchive = currentPath === "/articles";
  const isAbout = currentPath === "/about";

  const items: DropdownMenuItemDef[] = [
    {
      type: "item",
      label: "Blog",
      href: "/",
      rightText: "/",
      active: isHome,
      icon: <span block size="4" shrink="0" className="i-lucide:pen-line" />,
    },
    {
      type: "item",
      label: "Archive",
      href: "/articles",
      rightText: "/articles",
      active: isArchive,
      icon: <span block size="4" shrink="0" className="i-lucide:archive" />,
    },
    { type: "separator" },
    { type: "label", label: "執筆者" },
  ];

  for (const author of authors) {
    const authorPath = `/@${author.id}`;
    const isAuthorActive = currentPath === authorPath;

    items.push({
      type: "item",
      label: author.name,
      href: authorPath,
      rightText: authorPath,
      active: isAuthorActive,
      icon: (
        <img
          src={author.avatar}
          alt={`${author.name} のアバター画像`}
          width={16}
          height={16}
          className="size-4 rounded-full object-contain shrink-0"
        />
      ),
    });
  }

  items.push({ type: "separator" });
  items.push({
    type: "item",
    label: "About",
    href: "/about",
    rightText: "/about",
    active: isAbout,
    icon: <span block size="4" shrink="0" className="i-lucide:info" />,
  });

  return items;
};

const buildCategoryMenuItems = (
  categories: Category[],
): DropdownMenuItemDef[] => {
  const items: DropdownMenuItemDef[] = [{ type: "label", label: "カテゴリー" }];

  for (const cat of categories) {
    const href = `/articles/${cat.id}`;

    items.push({
      type: "item" as const,
      label: cat.name,
      href,
      rightText: `${cat.articleCount}`,
    });
  }

  return items;
};

const buildTocMenuItems = (
  headings: MarkdownHeading[],
  activeSlug: string | null,
): DropdownMenuItemDef[] => {
  const items: DropdownMenuItemDef[] = [{ type: "label", label: "目次" }];

  for (const heading of headings) {
    items.push({
      type: "item",
      label: heading.text,
      href: `#${heading.slug}`,
      active: heading.slug === activeSlug,
      indent: (heading.depth - 2) * 2,
      icon: <span block size="4" shrink="0" className="i-lucide:hash" />,
    });
  }

  return items;
};

export const MainBreadcrumbs = ({
  children,
  currentPath,
  authors = [],
  categories = [],
  headings = [],
  breadcrumbs = [],
}: MainBreadcrumbsProps) => {
  const blogTriggerLabel = useMemo(
    () => resolveBlogTriggerLabel(currentPath, authors),
    [currentPath, authors],
  );

  const blogTriggerIcon = useMemo(
    () => resolveBlogTriggerIcon(currentPath, authors),
    [currentPath, authors],
  );

  const blogMenuItems = useMemo(
    () => buildBlogMenuItems(currentPath, authors),
    [currentPath, authors],
  );

  const currentCategory = breadcrumbs[0];

  const categoryMenuItems = useMemo(
    () => buildCategoryMenuItems(categories),
    [categories],
  );

  const headingSlugs = useMemo(
    () => new Set(headings.map((h) => h.slug)),
    [headings],
  );

  const getHash = useCallback(
    () =>
      typeof window !== "undefined"
        ? decodeURIComponent(window.location.hash.slice(1))
        : "",
    [],
  );

  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(getHash());

    const onHashChange = () => setHash(getHash());

    window.addEventListener("hashchange", onHashChange);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, [getHash]);

  const activeHeadingSlug = headingSlugs.has(hash) ? hash : null;

  const tocMenuItems = useMemo(
    () =>
      headings.length > 0 ? buildTocMenuItems(headings, activeHeadingSlug) : [],
    [headings, activeHeadingSlug],
  );

  const tocTriggerLabel = useMemo(() => {
    if (activeHeadingSlug) {
      const heading = headings.find((h) => h.slug === activeHeadingSlug);

      if (heading) return heading.text;
    }

    return "目次";
  }, [activeHeadingSlug, headings]);

  const tocTriggerIcon = useMemo(
    () =>
      activeHeadingSlug ? (
        <span block size="4" shrink="0" className="i-lucide:hash" />
      ) : (
        <span
          block
          size="4"
          shrink="0"
          className="i-lucide:table-of-contents"
        />
      ),
    [activeHeadingSlug],
  );

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            {/*
            <a href="https://wycey.dev" aria-label="Wycey メインページへ">
              {children}
            </a>
            */}
            {children}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbDropdownItem
          triggerLabel={blogTriggerLabel}
          triggerIcon={blogTriggerIcon}
          items={blogMenuItems}
        />

        {currentCategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbDropdownItem
              triggerLabel={currentCategory.name}
              items={categoryMenuItems}
            />
          </>
        )}

        {headings.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbDropdownItem
              triggerLabel={tocTriggerLabel}
              items={tocMenuItems}
              triggerIcon={tocTriggerIcon}
            />
          </>
        )}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
