import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { FiFilter } from "react-icons/fi";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LEGITIMATE_ENUM, MOOD_ENUM, TIME_ENUM } from "@/constants/enum";

export type DateRangeKey = "1w" | "1m" | "1y";

export type FilterDraft = {
  dateRange?: DateRangeKey;
  mood?: keyof typeof MOOD_ENUM;
  time?: keyof typeof TIME_ENUM;
  legitimate?: keyof typeof LEGITIMATE_ENUM;
};

type Props = {
  value?: FilterDraft;
  onApply?: (next: FilterDraft) => void;
};

const countActive = (f: FilterDraft) =>
  (f.dateRange ? 1 : 0) +
  (f.mood ? 1 : 0) +
  (f.time ? 1 : 0) +
  (f.legitimate ? 1 : 0);

const pillClass = cn(
  "px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors",
  "border border-dark_blue/15 text-dark_blue/70 bg-transparent",
  "hover:bg-dark_blue/5",
  "data-[state=on]:bg-dark_blue data-[state=on]:text-white data-[state=on]:border-dark_blue",
);

export default function FilterButton({ value = {}, onApply }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(value);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const set = <K extends keyof FilterDraft>(key: K, v: FilterDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const activeCount = countActive(value);
  const draftCount = countActive(draft);

  const handleReset = () => setDraft({});

  const handleApply = () => {
    onApply?.(draft);
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild className="cursor-pointer">
        <button className="relative border border-dark_blue flex items-center gap-2 cursor-pointer py-2 px-6 md:py-4 md:px-8 text-dark_blue bg-transparent rounded-full font-semibold text-base sm:text-lg md:text-xl hover:bg-dark_blue/10 transition-all duration-300">
          <FiFilter className="w-4 h-4" />
          {t("common.filterBy")}
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-dark_blue px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 md:w-88 p-0 gap-0 bg-beige border border-dark_blue/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark_blue/10">
          <h2 className="text-sm font-semibold text-dark_blue">
            {t("filters.title")}
          </h2>
          <button
            type="button"
            onClick={handleReset}
            disabled={draftCount === 0}
            className="text-xs font-medium text-dark_blue/60 hover:text-dark_blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {t("filters.reset")}
          </button>
        </div>

        <Section label={t("filters.dateRange")}>
          <ToggleGroup
            type="single"
            value={draft.dateRange ?? ""}
            onValueChange={(v) =>
              set("dateRange", (v || undefined) as DateRangeKey | undefined)
            }
            className="flex flex-wrap gap-2"
          >
            <ToggleGroupItem value="1w" className={pillClass}>
              {t("filters.ranges.week")}
            </ToggleGroupItem>
            <ToggleGroupItem value="1m" className={pillClass}>
              {t("filters.ranges.month")}
            </ToggleGroupItem>
            <ToggleGroupItem value="1y" className={pillClass}>
              {t("filters.ranges.year")}
            </ToggleGroupItem>
          </ToggleGroup>
        </Section>

        <Section label={t("thoughts.time")}>
          <ToggleGroup
            type="single"
            value={draft.time ?? ""}
            onValueChange={(v) =>
              set(
                "time",
                (v || undefined) as keyof typeof TIME_ENUM | undefined,
              )
            }
            className="flex flex-wrap gap-2"
          >
            <ToggleGroupItem value="PAST" className={pillClass}>
              {t("timeIndex.PAST")}
            </ToggleGroupItem>
            <ToggleGroupItem value="FUTURE" className={pillClass}>
              {t("timeIndex.FUTURE")}
            </ToggleGroupItem>
          </ToggleGroup>
        </Section>

        <Section label={t("thoughts.legitimate")}>
          <ToggleGroup
            type="single"
            value={draft.legitimate ?? ""}
            onValueChange={(v) =>
              set(
                "legitimate",
                (v || undefined) as keyof typeof LEGITIMATE_ENUM | undefined,
              )
            }
            className="flex flex-wrap gap-2"
          >
            <ToggleGroupItem value="YES" className={pillClass}>
              {t("filters.yes")}
            </ToggleGroupItem>
            <ToggleGroupItem value="MAYBE" className={pillClass}>
              {t("filters.maybe")}
            </ToggleGroupItem>
            <ToggleGroupItem value="NO" className={pillClass}>
              {t("filters.no")}
            </ToggleGroupItem>
          </ToggleGroup>
        </Section>

        <Section label={t("thoughts.mood")} last>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(MOOD_ENUM) as Array<keyof typeof MOOD_ENUM>).map(
              (key) => {
                const mood = MOOD_ENUM[key];
                const isActive = draft.mood === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("mood", isActive ? undefined : key)}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${mood.color}1A`,
                            borderColor: mood.color,
                            color: mood.color,
                          }
                        : undefined
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors",
                      !isActive &&
                        "border-dark_blue/15 text-dark_blue/70 hover:bg-dark_blue/5",
                    )}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: mood.color }}
                    />
                    {t(`mood.${key}`)}
                  </button>
                );
              },
            )}
          </div>
        </Section>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-dark_blue/10">
          <Button
            type="button"
            onClick={handleCancel}
            className="flex-1 cursor-pointer bg-transparent text-dark_blue border border-dark_blue/15 hover:bg-dark_blue/5 hover:text-dark_blue"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 cursor-pointer bg-dark_blue text-white hover:bg-dark_blue/90"
          >
            {t("filters.apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Section({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-4 py-3",
        !last && "border-b border-dark_blue/10",
      )}
    >
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-dark_blue/60">
        {label}
      </h3>
      {children}
    </div>
  );
}
