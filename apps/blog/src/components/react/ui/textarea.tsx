import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      flex
      min-h="16"
      w="full"
      bg="transparent disabled:bg-subtle"
      border="px border focus-visible:border-hover"
      outline="none"
      ring="0 focus-visible:ring-3"
      text="base md:sm placeholder:fg-muted"
      transition="colors"
      field-sizing="content"
      p="x-2.5 y-2"
      rounded="2"
      className={cn(
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
