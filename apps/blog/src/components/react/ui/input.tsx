import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      relative
      h="8 file:6"
      w="full"
      min-w="0"
      p="x-2.5 y-1"
      text="base md:sm file:sm file:fg placeholder:fg-muted"
      font="file:medium"
      flex
      items="center"
      rounded="2"
      bg="bg-normal disabled:bg-subtle"
      border="px border focus-visible:border-hover file:0"
      outline="none"
      transition="colors"
      ring="focus-visible:3"
      className={cn(
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
