const { loadConfigFromFile, mergeConfig } = require("vite");
const path = require("path");
module.exports = {
  stories: [
    "../src/overview.stories.mdx",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-measure",
    "@storybook/addon-actions",
  ],
  framework: "@storybook/web-components",
  core: { builder: "@storybook/builder-vite" },
  async viteFinal(config) {
    const { config: libConfig } = await loadConfigFromFile(
      path.resolve(__dirname, "../vite.config.ts")
    );
    if (process.env.NODE_ENV === "production") {
      config.base = "design-system"; // base URL for production
    }
    if (process.env.BASE_URL) {
      config.base = process.env.BASE_URL;
    }
    return mergeConfig(config, { plugins: libConfig.plugins });
  },
};
