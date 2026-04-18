import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export interface DropDownItem {
  value: string;
  label: string;
  color?: string;
}

interface DropDownProps {
  placeholder: string;
  items: DropDownItem[];
  value: string;
  onValueChange: (value: string) => void;
  emptyLabel?: string;
}

export default function DropDown({
  placeholder,
  items,
  value,
  onValueChange,
  emptyLabel = "No items found.",
}: DropDownProps) {
  const selected = items.find((item) => item.value === value) ?? null;

  return (
    <Combobox<DropDownItem>
      items={items}
      value={selected}
      onValueChange={(next: DropDownItem | null) =>
        onValueChange(next?.value ?? "")
      }
    >
      <ComboboxInput
        placeholder={placeholder}
        className="px-4 rounded-full py-6 border-dark_blue [&_input]:font-general [&_input]:text-dark_blue [&_input]:placeholder:text-dark_blue/50"
      />
      <ComboboxContent className="bg-beige">
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList className="bg-beige">
          {(item: DropDownItem) => (
            <ComboboxItem
              key={item.value}
              value={item}
              className="font-general font-semibold text-dark_blue data-highlighted:bg-brown/15"
            >
              {item.color && (
                <span
                  aria-hidden
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span>{item.label}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
