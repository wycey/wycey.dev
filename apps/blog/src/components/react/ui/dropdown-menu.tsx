import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

function DropdownMenu({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        z="50"
        max-h="var(--radix-dropdown-menu-content-available-height)"
        w="var(--radix-dropdown-menu-trigger-width)"
        min-w="48"
        transform-origin="var(--radix-dropdown-menu-content-transform-origin)"
        overflow="x-hidden y-auto"
        rounded="2"
        bg="bg-subtle"
        p="2"
        text="fg"
        shadow="md"
        ring="1 fg-10/10"
        radix-open="animate-in fade-in-0 zoom-in-95"
        radix-closed="overflow-hidden animate-out fade-out-0 zoom-out-95"
        className={cn(
          "duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      relative
      flex
      cursor="pointer"
      items="center"
      gap="1.5"
      rounded="1"
      p="x-3 y-2"
      text="sm"
      outline="none"
      select="none"
      focus="bg-bg-muted"
      radix-disabled="pointer-events-none opacity-50"
      className={cn("group/dropdown-menu-item", className)}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      relative
      flex
      items="center"
      gap="1.5"
      cursor="default"
      rounded="1"
      p="y-2 r-8 l-3"
      text="sm"
      outline="none"
      select="none"
      focus="bg-bg-muted"
      radix-disabled="pointer-events-none opacity-50"
      className={cn(className)}
      // biome-ignore lint/style/noNonNullAssertion: checked can be undefined, but Radix will treat it as false
      checked={checked!}
      {...props}
    >
      <span
        data-slot="dropdown-menu-checkbox-item-indicator"
        absolute
        flex
        items="center"
        justify="center"
        pointer-events="none"
        className="right-2"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <span block className="i-lucide:check" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      relative
      flex
      cursor="pointer"
      items="center"
      gap="1.5"
      rounded="1"
      p="y-2 r-8 l-3"
      text="sm"
      outline="none"
      select="none"
      focus="bg-bg-muted"
      radix-disabled="pointer-events-none opacity-50"
      className={cn(className)}
      {...props}
    >
      <span
        data-slot="dropdown-menu-radio-item-indicator"
        absolute
        flex
        items="center"
        justify="center"
        pointer-events="none"
        className="right-2"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <span block className="i-lucide:check" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      p="x-1.5 y-1"
      text="xs fg-muted"
      font="medium"
      className={className}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      m="x--1 y-1.5"
      h="px"
      bg="border"
      className={className}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      ml="auto"
      text="xs fg-muted"
      className={cn(className)}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      flex
      items="center"
      gap="1.5"
      cursor="pointer"
      rounded="1"
      p="x-3 y-2"
      text="sm"
      outline="none"
      select="none"
      focus="bg-bg-muted"
      radix-open="bg-bg-muted"
      className={cn(className)}
      {...props}
    >
      {children}
      <span block className="i-lucide:chevron-right" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      z="50"
      min-w="96px"
      max-h="var(--radix-dropdown-menu-content-available-height)"
      overflow="hidden"
      bg="bg-subtle"
      rounded="2"
      p="2"
      text="fg"
      shadow="lg"
      ring="1 fg-10/10"
      transform-origin="var(--radix-dropdown-menu-content-transform-origin)"
      radix-open="animate-in fade-in-0 zoom-in-95"
      radix-closed="overflow-hidden animate-out fade-out-0 zoom-out-95"
      className={cn(
        "duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
