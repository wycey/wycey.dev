import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/classnames";

type NativeSelectProps = Omit<ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
};

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      relative
      w="fit"
      className={cn(
        "group/native-select has-[select:disabled]:opacity-50",
        className,
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        h="8 data-[size=sm]:7"
        w="full"
        p="y-1 r-8 l-2.5 data-[size=sm]:py-0.5"
        min-w="0"
        bg="transparent"
        text="sm"
        rounded="2 data-[size=sm]:[min(0.25rem,10px)]"
        border="px border"
        select="none"
        outline="none"
        ring="focus-visible:3"
        transition="shadow,colors"
        className="placeholder:text-fg-muted appearance-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />
      <span
        data-slot="native-select-icon"
        aria-hidden="true"
        block
        absolute
        size="4"
        text="fg-muted"
        pointer-events="none"
        select="none"
        className="i-lucide:chevron-down top-1/2 right-2.5 -translate-y-1/2"
      />
    </div>
  );
}

function NativeSelectOption({ ...props }: ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}

function NativeSelectOptGroup({
  className,
  ...props
}: ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
