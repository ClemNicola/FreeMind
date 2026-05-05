import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import DropDown, { type DropDownItem } from "../../../components/DropDown";
import { MOOD_ENUM } from "../../../constants/enum";
import type { CreateThoughtFormValues } from ".";

export default function StepMood() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateThoughtFormValues>();

  const moods = Object.values(MOOD_ENUM);
  const items: DropDownItem[] = moods.map((mood) => ({
    value: mood.value,
    label: t(`mood.${mood.value}`, { defaultValue: mood.label }),
    color: mood.color,
  }));

  const selected = values.mood ? MOOD_ENUM[values.mood] : null;

  return (
    <section className="font-general flex flex-col gap-2">
      <h1 className="text-xl md:text-4xl font-semibold text-dark_blue">
        {t("createThought.mood.title")}
      </h1>
      <p className="mt-2 text-base md:text-lg font-light text-dark_blue/80">
        {t("createThought.mood.subtitle")}
      </p>

      <div className="mt-8 max-w-lg w-full">
        <DropDown
          placeholder={t("createThought.mood.placeholder")}
          items={items}
          value={values.mood}
          onValueChange={(next) => setFieldValue("mood", next)}
          emptyLabel={t("createThought.mood.empty")}
        />

        {selected && (
          <p className="mt-8 text-sm md:text-base font-medium text-dark_blue">
            {t("createThought.mood.timeIndexLabel")}{" "}
            <span className="font-bold text-dark_blue uppercase tracking-wide text-xl">
              {t(`timeIndex.${selected.timeIndex}`, {
                defaultValue: selected.timeIndex,
              })}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
