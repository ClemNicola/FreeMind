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
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-3xl font-general font-medium">
        Please find attached your
        <span className="font-mogi text-brown">Mindy</span> recovery phrase.
      </h2>

      <div className="flex gap-4 my-4 flex-wrap justify-center items-center">
        {words.map((word, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-dark_blue p-4"
            >
              <p className="text-lg font-general font-medium">{word}</p>
            </div>
          );
        })}
        <button
          onClick={handleCopy}
          className="border border-dark_blue text-dark_blue px-4 py-2 rounded-xl hover:bg-dark_blue hover:text-white transition-all duration-300"
        >
          <FiCopy size={20} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <button
        onClick={onConfirm}
        className="bg-dark_blue text-white px-4 py-2 rounded-full"
      >
        {t("signup.continue")}
      </button>
    </div>
  );
}
