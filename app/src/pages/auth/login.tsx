import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import mindyLogo from "/img/mindy.webp";
import { useAuthControllerSignIn } from "../../api/generated";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: signIn } = useAuthControllerSignIn();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const storage = values.rememberMe ? localStorage : sessionStorage;
    signIn(
      { data: { email: values.email, password: values.password } },
      {
        onSuccess: (response) => {
          const { accessToken, refreshToken } = response.data;
          storage.setItem("accessToken", accessToken);
          storage.setItem("refreshToken", refreshToken);
          toast.success(t("login.successToast"));
          navigate("/dashboard");
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="md:grid md:grid-cols-2 min-h-screen">
      <div className="flex flex-col justify-between min-h-screen px-8 py-12 md:px-20 md:py-10 md:bg-white font-general">
        <div className="text-dark_blue md:pt-10">
          <h1 className="text-5xl font-mogi text-brown md:hidden">Mindy</h1>
          <h1 className="text-5xl font-semibold hidden md:block">
            {t("login.welcomeBack")}
          </h1>
          <div className="flex flex-col gap-1 mt-4 md:mt-0">
            <p className="text-2xl font-bold text-dark_blue md:hidden">
              {t("login.welcomeBack")}
            </p>
            <p className="text-base md:text-lg font-light text-dark_blue md:pt-4">
              {t("login.subtitle")}
            </p>
          </div>
        </div>
        <LoginForm handleSubmit={handleSubmit} />
        <div className="text-center text-dark_blue font-medium">
          <p>
            {t("login.noAccount")}{" "}
            <Link
              className="text-dark_blue font-bold hover:underline cursor-pointer transition-all duration-300"
              to="/signup"
            >
              {t("login.createOne")}
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center text-brown py-10">
        <h1 className="text-9xl font-semibold font-mogi">MINDY</h1>
        <p className="text-3xl font-general font-medium pt-4">
          {t("login.tagline")}
        </p>
        <img
          src={mindyLogo}
          alt={t("login.logoAlt")}
          className="w-1/2 object-contain"
        />
      </div>
    </div>
  );
}

const LoginForm = ({
  handleSubmit,
}: {
  handleSubmit: (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validate={(values) => {
        const errors: { email?: string; password?: string } = {};
        if (!values.email) {
          errors.email = t("login.validation.emailRequired");
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = t("login.validation.invalidEmail");
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col gap-1 md:gap-2">
            <label
              htmlFor="email"
              className="text-sm md:text-base font-semibold text-dark_blue"
            >
              {t("login.email")}
            </label>
            <Field
              name="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              className="border border-dark_blue rounded-md p-3 md:p-2 bg-transparent placeholder:text-dark_blue/50"
            />
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <label
              htmlFor="password"
              className="text-sm md:text-base font-semibold text-dark_blue"
            >
              {t("login.password")}
            </label>
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("login.passwordPlaceholder")}
                className="border border-dark_blue rounded-md p-3 md:p-2 pr-10 w-full bg-transparent placeholder:text-dark_blue/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark_blue/60 hover:text-dark_blue transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-dark_blue">
            <label className="flex items-center gap-2 cursor-pointer">
              <Field
                name="rememberMe"
                type="checkbox"
                className="accent-dark_blue w-4 h-4 cursor-pointer"
              />
              <span className="font-light">{t("login.rememberMe")}</span>
            </label>
            <Link to="/forgot" className="font-light hover:underline">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <button
            type="submit"
            className="bg-dark_blue p-4 text-white rounded-full font-bold text-lg hover:bg-dark_blue/80 transition-all duration-300 mt-2 md:mt-8"
          >
            {t("login.submit")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};
