export const TIME_ENUM = {
  PAST: "PAST",
  FUTURE: "FUTURE",
};

export const MOOD_ENUM = {
  DEPRESSION: {
    label: "DEPRESSION",
    value: "DEPRESSION",
    timeIndex: TIME_ENUM.PAST,
    color: "#4C6EF5", // indigo vif
  }, //PAST
  ANGER: {
    label: "ANGER",
    value: "ANGER",
    timeIndex: TIME_ENUM.PAST,
    color: "#FA5252", // rouge corail
  }, //PAST
  SHAME: {
    label: "SHAME",
    value: "SHAME",
    timeIndex: TIME_ENUM.PAST,
    color: "#BE4BDB", // magenta
  }, //PAST
  REGRETS: {
    label: "REGRETS",
    value: "REGRETS",
    timeIndex: TIME_ENUM.PAST,
    color: "#12B886", // émeraude
  }, //PAST,
  ADDICTIONS: {
    label: "ADDICTIONS",
    value: "ADDICTIONS",
    timeIndex: TIME_ENUM.PAST,
    color: "#FD7E14", // orange vif
  }, //PAST
  PARANOIA: {
    label: "PARANOIA",
    value: "PARANOIA",
    timeIndex: TIME_ENUM.PAST,
    color: "#7950F2", // violet électrique
  }, //PAST
  ANXIETY: {
    label: "ANXIETY",
    value: "ANXIETY",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#15AABF", // cyan
  }, //FUTURE
  FEAR_OF_UNCERTAINTY: {
    label: "FEAR_OF_UNCERTAINTY",
    value: "FEAR_OF_UNCERTAINTY",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#7048E8", // violet profond
  }, //FUTURE
  ANTICIPATION: {
    label: "ANTICIPATION",
    value: "ANTICIPATION",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#FAB005", // ambre / soleil
  }, //FUTURE
  WORRY: {
    label: "WORRY",
    value: "WORRY",
    timeIndex: TIME_ENUM.PAST,
    color: "#339AF0", // bleu ciel
  }, //PAST
  STRESS: {
    label: "STRESS",
    value: "STRESS",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#E64980", // rose framboise
  }, //FUTURE
};

export const LEGITIMATE_ENUM = {
  YES: "YES",
  NO: "NO",
};
