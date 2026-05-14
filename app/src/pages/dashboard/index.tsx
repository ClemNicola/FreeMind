import { useQuery } from "@tanstack/react-query";
import { thoughtsControllerGetStats } from "@/api/generated";
import { useState } from "react";
import clsx from "clsx";
import useIndexLookUp from "@/hooks/useIndexLookUp";
import { MOOD_ENUM } from "@/constants/enum";

const FONT_SIZE_MIN = 1.25;
const FONT_SIZE_MAX = 4;

export default function Dashboard() {
  const [range, setRange] = useState<"7d" | "30d" | "all">("all");
  const { data: statsData } = useQuery({
    queryKey: ["stats", range],
    queryFn: () =>
      thoughtsControllerGetStats({
        range,
      }),
  });

  const lookup = useIndexLookUp();

  const decodeMood = (moodIndex: string) => {
    return lookup?.mood.get(moodIndex) || moodIndex;
  };
  //   const decodeTime = (timeIndex: string) => {
  //     return lookup?.time.get(timeIndex) || timeIndex;
  //   };
  //   const decodeLegitimate = (legitimateIndex: string) => {
  //     return lookup?.legitimate.get(legitimateIndex) || legitimateIndex;
  //   };

  function computeFontSize(count: number, maxCount: number) {
    if (maxCount === 0) return `${FONT_SIZE_MIN}rem`;
    const ratio = count / maxCount;
    const targetRem = FONT_SIZE_MIN + ratio * (FONT_SIZE_MAX - FONT_SIZE_MIN);
    const minRem = targetRem * 0.55;
    const vwSize = targetRem * 1.8;
    return `clamp(${minRem.toFixed(2)}rem, ${vwSize.toFixed(2)}vw, ${targetRem.toFixed(2)}rem)`;
  }

  const moods = [...(statsData?.data.totalMood ?? [])].sort(
    (a, b) => b._count - a._count,
  );
  const maxCount = moods[0]?._count ?? 0;

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6 md:gap-8">
      <section className="border-b border-dark_blue pb-6 flex justify-between items-end ">
        <div className="max-w-xl flex flex-col gap-8">
          <h1 className="text-sm sm:text-base md:text-lg font-general text-dark_blue">
            Dashboard
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold font-general text-dark_blue">
            A look at what's been on your mind.
          </h2>
          <div className="mt-6 mb-2 flex items-center border border-dark_blue rounded-full px-4 py-2 max-w-fit gap-1">
            <div
              onClick={() => setRange("7d")}
              className={clsx(
                "cursor-pointer hover:bg-dark_blue hover:text-white rounded-full px-8 py-1 duration-300 transition-all",
                range === "7d" && "bg-dark_blue",
              )}
            >
              <span
                className={clsx(
                  "text-sm sm:text-base md:text-lg font-general",
                  range === "7d" && "text-white",
                )}
              >
                7 days
              </span>
            </div>
            <div
              onClick={() => setRange("30d")}
              className={clsx(
                "cursor-pointer hover:bg-dark_blue hover:text-white rounded-full px-8 py-1 duration-300 transition-all",
                range === "30d" && "bg-dark_blue",
              )}
            >
              <span
                className={clsx(
                  "text-sm sm:text-base md:text-lg font-general",
                  range === "30d" && "text-white",
                )}
              >
                30 days
              </span>
            </div>
            <div
              onClick={() => setRange("all")}
              className={clsx(
                "cursor-pointer hover:bg-dark_blue hover:text-white rounded-full px-8 py-1 duration-300 transition-all",
                range === "all" && "bg-dark_blue",
              )}
            >
              <span
                className={clsx(
                  "text-sm sm:text-base md:text-lg font-general",
                  range === "all" && "text-white",
                )}
              >
                All time
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-semibold font-general text-dark_blue">
              {statsData?.data.totalThoughts}
            </h3>
            <p className="text-base sm:text-lg md:text-xl font-general text-brown">
              saved thoughts
            </p>
          </div>
          <div className="w-px h-16 bg-dark_blue" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-semibold font-general text-dark_blue">
              {statsData?.data.streak}
            </h3>
            <p className="text-base sm:text-lg md:text-xl font-general text-brown">
              day streak
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 pb-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-general text-dark_blue">
          What have you been feeling
        </h3>
        <div className="flex items-center gap-2">
          {moods.map((mood) => {
            const moodKey = decodeMood(mood.moodIndex);
            const moodInfo = MOOD_ENUM[moodKey as keyof typeof MOOD_ENUM];
            const fontSize = computeFontSize(mood._count, maxCount);
            return (
              <div key={mood.moodIndex} className="flex items-start gap-2">
                <span
                  className="font-general font-semibold lowercase leading-none"
                  style={{ fontSize, color: moodInfo?.color ?? "#1a1a2e" }}
                >
                  {moodKey}
                </span>
                <span
                  className="font-general font-normal opacity-60 text-brown leading-none"
                  style={{ fontSize: `calc(${fontSize} * 0.4)` }}
                >
                  {mood._count}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
