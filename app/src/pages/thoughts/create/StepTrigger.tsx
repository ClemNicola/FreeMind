import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import type { CreateThoughtFormValues } from ".";
import { Textarea } from "../../../components/ui/textarea";

export default function StepTrigger() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateThoughtFormValues>();

  return (
    <section className="font-general flex flex-col gap-2">
      <h1 className="text-xl md:text-4xl font-semibold text-dark_blue max-w-2xl">
        {t("createThought.trigger.title")}
      </h1>
      <p className="mt-2 text-base md:text-lg font-light text-dark_blue/80 max-w-2xl">
        {t("createThought.trigger.subtitle")}
      </p>

      <div className="mt-8 max-w-lg w-full">
        <Textarea
          placeholder={t("createThought.trigger.placeholder")}
          value={values.trigger}
          onChange={(e) => setFieldValue("trigger", e.target.value)}
        />
      </div>
    </section>
  );
}
