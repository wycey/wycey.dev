/** biome-ignore-all lint/suspicious/noArrayIndexKey: Items are static and won't change order */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/classnames";
import { BreadcrumbItem } from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
      <DropdownMenu modal={false}>
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
        <DropdownMenuContent
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
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
                      item.active && "bg-accent text-accent-foreground",
                    )}
                    disabled
                  >
                    {content}
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem key={`item-${i}`} asChild>
                  <a
                    href={item.href}
                    className={cn(
                      item.active && "bg-accent text-accent-foreground",
                    )}
                  >
                    {content}
                  </a>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  );
}
