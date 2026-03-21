import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        isolate
        z="50"
        outline="none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          z="50"
          max-h="var(--available-height)"
          w="var(--anchor-width)"
          min-w="48"
          overflow="x-hidden y-auto"
          rounded="2"
          bg="bg-subtle"
          p="2"
          text="fg"
          shadow="md"
          ring="1 primary-10/10%"
          base-open="animate-in fade-in-0 zoom-in-95"
          base-closed="overflow-hidden animate-out fade-out-0 zoom-out-95"
          base-side-bottom="slide-in-from-t-2"
          base-side-left="slide-in-from-r-2"
          base-side-right="slide-in-from-l-2"
          base-side-top="slide-in-from-b-2"
          base-side-inline-start="slide-in-from-r-2"
          base-side-inline-end="slide-in-from-l-2"
          className={cn(
            "duration-100 origin-[var(--transform-origin)]",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      p="x-1.5 y-1 base-inset:l-7"
      text="xs fg-muted"
      font="medium"
      className={className}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
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
      focus="bg-bg-hover"
      transition="colors"
      base-disabled="pointer-events-none opacity-50"
      className={cn("group/dropdown-menu-item", className)}
      {...props}
    />
  );
}

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
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
      focus="bg-bg-hover text-primary-fg"
      transition="colors"
      base-open="bg-primary-bg text-primary-fg"
      base-popup-open="bg-primary-bg text-primary-fg"
      className={cn(className)}
      {...props}
    >
      {children}
      <span block className="i-lucide:chevron-right" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      z="50"
      w="auto"
      min-w="96px"
      max-h="var(--radix-dropdown-menu-content-available-height)"
      overflow="hidden"
      bg="bg-subtle"
      rounded="2"
      p="2"
      text="fg"
      shadow="lg"
      ring="1 primary-10/10%"
      base-open="animate-in fade-in-0 zoom-in-95"
      base-closed="overflow-hidden animate-out fade-out-0 zoom-out-95"
      base-side-bottom="slide-in-from-t-2"
      base-side-left="slide-in-from-r-2"
      base-side-right="slide-in-from-l-2"
      base-side-top="slide-in-from-b-2"
      className={cn(
        "duration-100 origin-[var(--radix-dropdown-menu-content-transform-origin)]",
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
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
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
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
      focus="bg-bg-hover"
      transition="colors"
      base-disabled="pointer-events-none opacity-50"
      className={cn(className)}
      checked={checked}
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
        <MenuPrimitive.CheckboxItemIndicator>
          <span block className="i-lucide:check" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
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
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      relative
      flex
      cursor="pointer"
      items="center"
      gap="1.5"
      rounded="1"
      p="y-2 r-8 l-3 base-inset:l-7"
      text="sm"
      outline="none"
      select="none"
      focus="bg-bg-hover"
      transition="colors"
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
        <MenuPrimitive.RadioItemIndicator>
          <span block className="i-lucide:check" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      m="x--1 y-1.5"
      h="px"
      bg="border"
      className={cn(className)}
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
      className={cn("tracking-widest", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
