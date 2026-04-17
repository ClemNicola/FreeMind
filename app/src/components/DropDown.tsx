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
  color?: string;
  emptyLabel?: string;
}

export default function DropDown({
  placeholder,
  items,
  value,
  onValueChange,
  color,
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
        className="font-general"
        style={
          color
            ? {
                borderColor: color,
                color,
                boxShadow: `0 0 0 1px ${color}33`,
              }
            : undefined
        }
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(item: DropDownItem) => (
            <ComboboxItem
              key={item.value}
              value={item}
              className="font-general font-medium"
              style={item.color ? { color: item.color } : undefined}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
