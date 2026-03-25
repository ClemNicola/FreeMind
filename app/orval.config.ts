import { defineConfig } from "orval";

export default defineConfig({
  thoughts: {
    input: {
      target: "http://localhost:3000/api/docs-json",
    },
    output: {
      target: "./src/api/generated.ts",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./src/api/api.ts",
          name: "apiInstance",
        },
      },
    },
  },
});
