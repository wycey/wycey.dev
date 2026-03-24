import { Command as CommandPrimitive } from "cmdk";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/classnames";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { InputGroup, InputGroupAddon } from "./input-group";

function Command({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      bg="bg-subtle"
      text="fg"
      rounded="4!"
      flex
      size="full"
      flex-col
      overflow="hidden"
      className={cn(className)}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        rounded="4!"
        translate-y="0"
        overflow="hidden"
        p="0"
        className={cn("top-1/3", className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" p="1" pb="0">
      <InputGroup
        bg="bg-normal/30%"
        h="8"
        rounded="4!"
        shadow="none!"
        className="*:data-[slot=input-group-addon]:pl-2!"
      >
        <CommandPrimitive.Input
          data-slot="command-input"
          w="full"
          text="sm"
          outline="none"
          className={cn(
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <InputGroupAddon>
          <span
            block
            size="4"
            shrink="0"
            className="i-lucide:search opacity-50"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      max-h="72"
      scroll-py="1"
      outline="none"
      overflow="x-hidden y-auto"
      className={cn("hide-scrollbar", className)}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      py="6"
      text="center sm"
      className={cn(className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      text="fg"
      overflow="hidden"
      p="1"
      className={cn(
        "**:[[cmdk-group-heading]]:text-fg-muted **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      bg="border"
      mx="-1"
      h="px"
      className={cn(className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      relative
      p="x-2 y-1.5"
      flex
      items="center"
      gap="2"
      bg="hover:bg-hover"
      rounded="1"
      cursor="pointer"
      text="sm"
      outline="none"
      select="none"
      transition="colors"
      className={cn(
        "data-[selected]:bg-bg-subtle data-[selected]:text-fg in-data-[slot=dialog-content]:rounded-lg! group/command-item data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <span
        block
        ml="auto"
        className="i-lucide:check group-has-data-[slot=command-shortcut]/command-item:hidden opacity-0 group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      text="xs fg-muted group-data-[selected]/command-item:fg"
      ml="auto"
      className={cn("tracking-widest", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
