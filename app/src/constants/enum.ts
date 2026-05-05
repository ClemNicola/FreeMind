export const TIME_ENUM = {
  PAST: "PAST",
  FUTURE: "FUTURE",
};

export const MOOD_ENUM = {
  DEPRESSION: {
    label: "DEPRESSION",
    value: "DEPRESSION",
    timeIndex: TIME_ENUM.PAST,
    color: "#364FC7", // bleu profond (plus sombre, distinct)
  },

  ANGER: {
    label: "ANGER",
    value: "ANGER",
    timeIndex: TIME_ENUM.PAST,
    color: "#D00000", // rouge intense
  },

  SHAME: {
    label: "SHAME",
    value: "SHAME",
    timeIndex: TIME_ENUM.PAST,
    color: "#9C36B5", // violet prune
  },

  REGRETS: {
    label: "REGRETS",
    value: "REGRETS",
    timeIndex: TIME_ENUM.PAST,
    color: "#2F9E44", // vert forêt
  },

  ADDICTIONS: {
    label: "ADDICTIONS",
    value: "ADDICTIONS",
    timeIndex: TIME_ENUM.PAST,
    color: "#E8590C", // orange brûlé
  },

  PARANOIA: {
    label: "PARANOIA",
    value: "PARANOIA",
    timeIndex: TIME_ENUM.PAST,
    color: "#5F3DC4", // violet sombre distinct
  },

  ANXIETY: {
    label: "ANXIETY",
    value: "ANXIETY",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#0CA678", // vert menthe anxieux (plus unique que cyan)
  },

  FEAR_OF_UNCERTAINTY: {
    label: "FEAR_OF_UNCERTAINTY",
    value: "FEAR_OF_UNCERTAINTY",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#F08C00", // orange ambre inquiétude
  },

  ANTICIPATION: {
    label: "ANTICIPATION",
    value: "ANTICIPATION",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#FFD43B", // jaune anticipation
  },

  WORRY: {
    label: "WORRY",
    value: "WORRY",
    timeIndex: TIME_ENUM.PAST,
    color: "#1971C2", // bleu moyen distinct de depression
  },

  STRESS: {
    label: "STRESS",
    value: "STRESS",
    timeIndex: TIME_ENUM.FUTURE,
    color: "#C2255C", // rose stress plus sombre
  },
};
export const LEGITIMATE_ENUM = {
  YES: "YES",
  NO: "NO",
  MAYBE: "MAYBE",
};
