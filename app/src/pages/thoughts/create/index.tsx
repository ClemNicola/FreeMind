import { useState } from "react";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { useThoughtsControllerCreate } from "../../../api/generated";
import { MOOD_ENUM, LEGITIMATE_ENUM } from "../../../constants/enum";
import StepMood from "./StepMood";

export interface CreateThoughtFormValues {
  mood: keyof typeof MOOD_ENUM | "";
  thought: string;
  context: string;
  legitimate: keyof typeof LEGITIMATE_ENUM | "";
}

const STEPS = [
  { id: "mood", Component: StepMood, requiredField: "mood" as const },
];

const TOTAL_STEPS = 4;

const initialValues: CreateThoughtFormValues = {
  mood: "",
  thought: "",
  context: "",
  legitimate: "",
};

export default function ThoughtCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  const createThought = useThoughtsControllerCreate({
    mutation: {
      onSuccess: () => {
        toast.success(t("createThought.successToast"));
        navigate("/thoughts");
      },
      onError: () => {
        toast.error(t("createThought.errorToast"));
      },
    },
  });

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const isFirstStep = stepIndex === 0;

  const handleSubmit = (values: CreateThoughtFormValues) => {
    if (!isLastStep) {
      setStepIndex((s) => s + 1);
      return;
    }
    // TODO: chiffrement client-side des champs thought/context
    // avant d’appeler createThought.mutate({ data: toDto(values) }).
    console.log("submit", values);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 md:px-20 md:py-14 font-general text-dark_blue">
      <header className="mb-8 md:mb-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-dark_blue/60">
            {t("createThought.stepProgress", {
              current: stepIndex + 1,
              total: TOTAL_STEPS,
            })}
          </p>
          <button
            type="button"
            onClick={() => navigate("/thoughts")}
            aria-label={t("createThought.cancel")}
            title={t("createThought.cancel")}
            className="cursor-pointer p-2 -mr-2 rounded-full text-dark_blue/60 hover:text-dark_blue hover:bg-dark_blue/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-dark_blue/60">
                {t("createThought.cancel")}
              </span>
              <FiX size={20} />
            </div>
          </button>
        </div>
        <div className="mt-2 h-1 w-full bg-dark_blue/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-dark_blue transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </header>

      <Formik<CreateThoughtFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          const canContinue = !!values[currentStep.requiredField];

          return (
            <Form className="flex-1 flex flex-col text-dark_blue">
              <div className="flex-1 flex items-center justify-center">
                {currentStep ? <currentStep.Component /> : null}
              </div>

              <footer className="mt-10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  disabled={isFirstStep}
                  className="px-6 py-3 rounded-full font-medium border border-dark_blue/30 text-dark_blue hover:bg-dark_blue/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {t("createThought.back")}
                </button>

                <button
                  type="submit"
                  disabled={!canContinue || createThought.isPending}
                  className="px-8 py-3 rounded-full font-bold text-white bg-dark_blue hover:bg-dark_blue/85 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isLastStep
                    ? t("createThought.submit")
                    : t("createThought.next")}
                </button>
              </footer>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
