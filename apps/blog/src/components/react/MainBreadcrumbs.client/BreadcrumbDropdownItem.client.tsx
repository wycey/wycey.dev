/** biome-ignore-all lint/suspicious/noArrayIndexKey: Items are static and won't change order */

import type { ReactNode } from "react";
import { BreadcrumbItem } from "@/components/react/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/react/ui/dropdown-menu";
import { cn } from "@/lib/utils/classnames";

export interface DropdownMenuItemDef {
  type: "item" | "separator" | "label";
  label?: string;
  href?: string;
  rightText?: string;
  active?: boolean;
  icon?: ReactNode;
  indent?: number;
}

export interface BreadcrumbDropdownItemProps {
  triggerLabel: string;
  triggerIcon?: ReactNode;
  items: DropdownMenuItemDef[];
}

export function BreadcrumbDropdownItem({
  triggerLabel,
  triggerIcon,
  items,
}: BreadcrumbDropdownItemProps) {
  return (
    <BreadcrumbItem>
      <DropdownMenu
        modal={false}
        onOpenChange={(open) => {
          // Prefetch all internal links
          if (open) {
            items.forEach((item) => {
              if (
                item.type === "item" &&
                item.href &&
                item.href.startsWith("/")
              ) {
                //prefetch(item.href); // https://github.com/withastro/astro/issues/15520
              }
            });
          }
        }}
      >
        <DropdownMenuTrigger
          flex
          gap="2"
          items="center"
          cursor="pointer"
          outline="none"
          text="hover:fg"
          transition="colors"
        >
          {triggerIcon}
          {triggerLabel}
          <span block className="i-lucide:chevron-down size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {items.map((item, i) => {
              if (item.type === "separator") {
                return <DropdownMenuSeparator key={`sep-${i}`} />;
              }

              if (item.type === "label") {
                return (
                  <DropdownMenuLabel key={`label-${i}`}>
                    {item.label}
                  </DropdownMenuLabel>
                );
              }

              const isDisabled = item.active && item.href !== undefined;

              const content = (
                <>
                  {item.icon}
                  <span
                    className={cn(item.active && "font-medium")}
                    style={
                      item.indent
                        ? {
                            paddingInlineStart: `calc(var(--spacing) * ${item.indent})`,
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </span>
                  {item.rightText && (
                    <span className="ml-auto text-xs text-fg-muted">
                      {item.rightText}
                    </span>
                  )}
                </>
              );

              if (isDisabled) {
                return (
                  <DropdownMenuItem
                    key={`item-${i}`}
                    className={cn(
                      item.active && "bg-primary-bg text-primary-fg",
                    )}
                    disabled
                  >
                    {content}
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem
                  key={`item-${i}`}
                  render={
                    <a
                      href={item.href}
                      className={cn(
                        item.active && "bg-primary-bg text-primary-fg",
                      )}
                    >
                      {content}
                    </a>
                  }
                />
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  );
}
