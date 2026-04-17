import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import mindyLogo from "/img/mindy.webp";
import { useAuthControllerSignUp } from "../../api/generated";
import SeedPhrase from "../../components/SeedPhrase";
import { toast } from "react-hot-toast";

import {
  deriveMasterKey,
  generateSalt,
  wrapMasterKey,
  toBase64,
} from "../../services/crypto";
import { generateSeedPhrase, hashSeedPhrase } from "../../services/seedPhrase";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);

  const { mutate: signUp, isPending } = useAuthControllerSignUp();

  const isLoading = isEncrypting || isPending;

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsEncrypting(true);
      const salt = generateSalt();
      const masterKey = await deriveMasterKey(values.password, salt);

      const seedPhrase = generateSeedPhrase();
      setSeedPhrase(seedPhrase);
      const recoveryKey = await deriveMasterKey(seedPhrase, salt);
      const wrappedMasterKey = await wrapMasterKey(masterKey, recoveryKey);
      const seedPhraseHash = await hashSeedPhrase(seedPhrase);
      signUp(
        {
          data: {
            email: values.email,
            password: values.password,
            salt: toBase64(salt),
            wrappedMasterKey: JSON.stringify(wrappedMasterKey),
            seedPhraseHash,
          },
        },
        {
          onSuccess: (response) => {
            setIsEncrypting(false);
            const { accessToken, refreshToken } = response.data;
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
            setStep("phrase");
          },
          onError: (error) => {
            setIsEncrypting(false);
            console.error(error);
          },
        },
      );
    } catch (error) {
      setIsEncrypting(false);
      console.error(error);
    }
  };

  if (step === "phrase" && seedPhrase) {
    return (
      <SeedPhrase
        seedPhrase={seedPhrase}
        onConfirm={() => {
          setStep(null);
          toast.success(t("signup.successToast"));
          navigate("/dashboard");
        }}
      />
    );
  }

  return (
    <div className="md:grid md:grid-cols-2 min-h-screen">
      <div className="flex flex-col justify-between min-h-screen px-8 py-12 md:px-20 md:py-10 md:bg-white font-general">
        <div className="text-dark_blue md:pt-10">
          <h1 className="text-5xl font-mogi text-brown md:hidden">Mindy</h1>
          <h1 className="text-5xl font-semibold hidden md:block">
            Welcome to Mindy
          </h1>
          <p className="text-xl font-general  font-medium md:font-light pt-4">
            The platform that helps you get rid of your intrusive thoughts.
          </p>
        </div>
        <SignupForm
          handleSubmit={handleSubmit}
          isEncrypting={isEncrypting}
          isPending={isPending}
          isLoading={isLoading}
        />
        <div className="text-center text-dark_blue">
          <p className="font-normal md:text-lg text-sm">
            Already have an account?{" "}
            <Link
              className="text-dark_blue font-bold hover:underline cursor-pointer transition-all duration-300"
              to="/login"
            >
              Login to your account
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

const SignupForm = ({
  handleSubmit,
  isLoading,
  isEncrypting,
  isPending,
}: {
  handleSubmit: (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  isEncrypting: boolean;
  isPending: boolean;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validate={(values) => {
        const errors: {
          email?: string;
          password?: string;
          confirmPassword?: string;
        } = {};
        if (!values.email) {
          errors.email = t("login.validation.emailRequired");
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = t("login.validation.invalidEmail");
        }
        if (!values.password) {
          errors.password = t("signup.validation.passwordRequired");
        }
        if (!values.confirmPassword) {
          errors.confirmPassword = t(
            "signup.validation.confirmPasswordRequired",
          );
        } else if (values.password !== values.confirmPassword) {
          errors.confirmPassword = t("signup.validation.passwordMismatch");
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
          <div className="flex flex-col gap-1 md:gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm md:text-base font-semibold text-dark_blue"
            >
              {t("signup.confirmPassword")}
            </label>
            <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("signup.confirmPasswordPlaceholder")}
                className="border border-dark_blue rounded-md p-3 md:p-2 pr-10 w-full bg-transparent placeholder:text-dark_blue/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark_blue/60 hover:text-dark_blue transition-colors"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-dark_blue p-4 text-white rounded-full font-bold text-lg hover:bg-dark_blue/80 transition-all duration-300 mt-2 md:mt-8"
            disabled={isLoading}
          >
            {isEncrypting
              ? t("signup.encrypting")
              : isPending
                ? t("signup.creating")
                : t("signup.submit")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};
