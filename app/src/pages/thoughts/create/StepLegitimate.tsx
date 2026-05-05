import { useTranslation } from "react-i18next";
import type { CreateThoughtFormValues } from ".";
import DropDown, { type DropDownItem } from "../../../components/DropDown";
import { useFormikContext } from "formik";

export default function StepLegitimate() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateThoughtFormValues>();

  const items: DropDownItem[] = [
    { value: "YES", label: t("createThought.legitimate.yes") },
    { value: "NO", label: t("createThought.legitimate.no") },
    { value: "MAYBE", label: t("createThought.legitimate.maybe") },
  ];

  return (
    <section className="font-general flex flex-col gap-2">
      <h1 className="text-xl md:text-4xl font-semibold text-dark_blue max-w-2xl">
        {t("createThought.legitimate.title")}
      </h1>
      <p className="mt-2 text-base md:text-lg font-light text-dark_blue/80 max-w-2xl">
        {t("createThought.legitimate.subtitle")}
      </p>

      <div className="mt-8 max-w-lg w-full">
        <DropDown
          placeholder={t("createThought.legitimate.placeholder")}
          items={items}
          value={values.legitimate}
          onValueChange={(next) => setFieldValue("legitimate", next)}
          emptyLabel={t("createThought.legitimate.empty")}
        />
      </div>
    </section>
  );
}
