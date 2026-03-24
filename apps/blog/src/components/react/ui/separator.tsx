import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils/classnames";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      bg="border"
      shrink="0"
      w="data-[horizontal]:full data-[vertical]:px"
      h="data-[horizontal]:px data-[vertical]=full"
      className={cn("data-[vertical]:self-stretch", className)}
      {...props}
    />
  );
}

export { Separator };
