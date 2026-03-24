import { Command as CommandPrimitive } from "cmdk";
import {
  type KeyboardEvent,
  type MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Badge } from "./ui/badge";
import { Command, CommandGroup, CommandItem } from "./ui/command";

interface Item {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  items: Item[];
  selected: Item[];
  onSelectedChange: (selected: Item[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  items,
  selected,
  onSelectedChange,
  placeholder = "",
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!(open && wrapperRef.current)) return;

    selected; // Recalculate position when selected items change to ensure dropdown stays aligned

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      if (!rect) return;

      setDropdownStyle({
        position: "absolute",
        top: rect.bottom - bodyRect.top + 4,
        left: rect.left - bodyRect.left,
        width: rect.width,
        zIndex: 50,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, selected]);

  const handleSelect = useCallback(
    (item: Item) => {
      setInputValue("");
      onSelectedChange([...selected, item]);
    },
    [selected, onSelectedChange],
  );

  const handleUnselect = useCallback(
    (item: Item) => {
      onSelectedChange(selected.filter((s) => s.value !== item.value));
    },
    [selected, onSelectedChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          input.value === ""
        ) {
          const newSelected = [...selected];
          newSelected.pop();
          onSelectedChange(newSelected);
        }

        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, onSelectedChange],
  );

  const haltEvent: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const selectables = items.filter(
    (item) => !selected.some((s) => s.value === item.value),
  );

  return (
    <Command
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
      bg="transparent"
      overflow="visible"
    >
      <div
        rounded="2"
        border="px border"
        outline="none"
        min-h="8"
        p="x-3 y-2"
        text="sm"
        ring="focus-within:3"
        transition="shadow,colors"
        className="group focus-within:border-border-hover"
      >
        <div flex gap="1" className="flex-wrap">
          {selected.map((item) => (
            <Badge key={item.value} variant="secondary">
              {item.label}
              <button
                type="button"
                ml="1"
                rounded="full"
                outline="none"
                ring="offset-bg focus:2 focus:offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={haltEvent}
                onClick={() => handleUnselect(item)}
              >
                <span
                  block
                  size="3"
                  text="fg hover:fg-muted"
                  className="i-lucide:x"
                />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            flex="1"
            bg="transparent"
            outline="none"
            ring="0"
            className="placeholder:text-fg-muted"
          />
        </div>
      </div>
      {open &&
        selectables.length > 0 &&
        createPortal(
          <div
            rounded="2"
            border="px border"
            bg="bg-subtle"
            text="fg"
            shadow="md"
            outline="none"
            style={dropdownStyle}
          >
            <CommandGroup h="full" overflow="auto" max-h="60">
              {selectables.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => handleSelect(item)}
                  onMouseDown={haltEvent}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>,
          document.body,
        )}
    </Command>
  );
};
