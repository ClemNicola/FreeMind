import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCopy } from "react-icons/fi";

export default function SeedPhrase({
  seedPhrase,
  onConfirm,
}: {
  seedPhrase: string;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const words = seedPhrase.split(" ");

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col justify-center items-center gap-6">
        <span className="font-mogi text-brown text-6xl">Mindy</span>
        <h2 className="text-3xl font-general font-medium">
          {t("seedPhrase.title")}
        </h2>
        <p className="max-w-xl text-center text-base font-semibold font-general text-brown/80 leading-relaxed px-2">
          {t("seedPhrase.warning")}
        </p>

        <div className="flex gap-4 items-center">
          <div className="flex gap-4 my-4 flex-wrap justify-center items-center p-4 border border-dark_blue rounded-xl">
            {words.map((word, index) => {
              return (
                <div key={index} className="flex items-center gap-4">
                  <p className="text-lg font-general font-medium">{word}</p>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleCopy}
            className="border border-dark_blue text-dark_blue flex items-center gap-2 hover:bg-dark_blue/80 hover:text-white transition-all duration-300 p-4 rounded-xl"
          >
            <FiCopy size={20} />
            {copied ? t("seedPhrase.copied") : t("seedPhrase.copy")}
          </button>
        </div>
        <button
          onClick={onConfirm}
          className="bg-dark_blue text-white py-4 px-6 rounded-full font-general font-medium text-xl hover:bg-dark_blue/80 transition-all duration-300"
        >
          {t("seedPhrase.goToAccount")}
        </button>
      </div>
    </div>
  );
}
