/** biome-ignore-all lint/a11y/noLabelWithoutControl: This is a independent component */

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      flex
      items="center"
      text="sm"
      font="medium"
      gap="2"
      select="none"
      className={cn(
        "group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
