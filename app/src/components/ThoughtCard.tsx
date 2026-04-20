import { MOOD_ENUM } from "@/constants/enum";
import type { DecryptedThought } from "@/pages/thoughts/list";
import DateConverter from "@/utils/DateConverter";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ThoughtCard({ thought }: { thought: DecryptedThought }) {
  const moodMeta = MOOD_ENUM[thought.mood as keyof typeof MOOD_ENUM];
  const { t } = useTranslation();
  return (
    <Link to={`/thoughts/${thought.id}`}>
      <div
        className="rounded-xl p-4 border font-general"
        style={{ borderColor: moodMeta?.color }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-dark_blue">
            {t("thoughts.createdAt")}:{" "}
            <span className="font-semibold">
              {DateConverter(thought.createdAt)}
            </span>
          </p>
          <p
            className="text-xs px-3 py-2 rounded-full uppercase tracking-wide font-semibold"
            style={{
              backgroundColor: `${moodMeta?.color}1A`,
              color: moodMeta?.color,
            }}
          >
            {moodMeta?.label}
          </p>
        </div>
        <div className="my-4">
          <p className="text-sm font-light text-dark_blue line-clamp-3">
            {thought.thought}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-dark_blue">
            {t("thoughts.time")}:{" "}
            <span className="font-semibold uppercase tracking-wide">
              {t(`timeIndex.${thought.time}`, { defaultValue: thought.time })}
            </span>
          </p>
          <p className="text-sm font-light text-dark_blue">
            {t("thoughts.legitimate")}:{" "}
            <span className="font-semibold uppercase tracking-wide">
              {t(`legitimate.${thought.legitimate}`, {
                defaultValue: thought.legitimate,
              })}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
