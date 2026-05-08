import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://yakser.github.io",
  base: "/asynqpg",
  output: "static",
  trailingSlash: "ignore",
  build: {
    assets: "_astro",
  },
});
