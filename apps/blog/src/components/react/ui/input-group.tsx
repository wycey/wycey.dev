import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: The div with role="group" is necessary for the input group to function correctly
    <div
      data-slot="input-group"
      role="group"
      relative
      h="8 has-[>textarea]:auto has-[>[data-align=block-start]]:auto has-[>[data-align=block-end]]:auto"
      w="full"
      min-w="0"
      p="has-[>[data-align=block-end]]:[&>input]:t-3 has-[>[data-align=block-start]]:[&>input]:b-3 has-[>[data-align=inline-end]]:[&>input]:r-1.5 has-[>[data-align=inline-start]]:[&>input]:l-1.5"
      flex
      items="center"
      rounded="2"
      bg="bg-normal has-disabled:bg-subtle"
      border="px border focus-visible:border-hover has-[[data-slot=input-group-control]:focus-visible]:border-hover in-data-[slot=combobox-content]:focus-within:inherit"
      ring="in-data-[slot=combobox-content]:focus-within:0 has-[[data-slot=input-group-control]:focus-visible]:3"
      outline="none"
      transition="colors"
      className={cn(
        "relative has-disabled:opacity-50 has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:flex-col group/input-group",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-fg-muted h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start":
          "pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first",
        "inline-end":
          "pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last",
        "block-start":
          "px-2.5 pt-2 group-has-[>input]/input-group:pt-2 order-first w-full justify-start",
        "block-end":
          "px-2.5 pb-2 group-has-[>input]/input-group:pb-2 order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: The onClick handler is necessary for the input group addon
    // biome-ignore lint/a11y/useSemanticElements: The div with role="group" is necessary for the input group addon to function correctly
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "gap-2 text-sm flex items-center shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5",
        sm: "",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0",
        "icon-sm": "size-8 p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      text="fg-muted sm"
      flex
      items="center"
      gap="2"
      className={cn(className)}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      flex="1"
      bg="transparent disabled:transparent"
      border="0"
      shadow="none"
      ring="0 focus-visible:0"
      rounded="none"
      className={cn(className)}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      flex="1"
      p="y-2"
      bg="transparent disabled:transparent"
      resize="none"
      border="0"
      shadow="none"
      ring="0 focus-visible:0"
      rounded="none"
      className={cn(className)}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
