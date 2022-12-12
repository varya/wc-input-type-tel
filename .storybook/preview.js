import { html } from "lit";
import { addParameters } from "@storybook/web-components";
/** If you add new CSS file,
 * please, don't forget to add it to src/index.ts
 * */

import "../src/tokens/build/_border.css";
import "../src/tokens/build/_colors.css";
import "../src/tokens/build/_rest.css";
import "../src/tokens/build/_shadow.css";
import "../src/tokens/build/_spacing.css";
import "../src/tokens/build/_sizing.css";
import "../src/tokens/build/_typography.css";
import "../src/tokens/build/_utility-classes.css";

import { setCustomElementsManifest } from "@storybook/web-components";

import customElementsManifest from "./public/custom-elements.json";

setCustomElementsManifest(customElementsManifest);

addParameters({
  grid: { cellSize: 8 }
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*", handles: ["ao-input", "ao-change"] },
  controls: {
    hideNoControlsWarning: true,
    expanded: true,
    exclude: /^data-/i,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
