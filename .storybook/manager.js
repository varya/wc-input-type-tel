import { addons } from "@storybook/addons";
import { create } from "@storybook/theming";
import colors from "../src/tokens/build/colors.json";
import typography from "../src/tokens/build/typography.json";

const myTheme = create({
  base: "light",
  brandTitle: "A Design System",

  // Typography
  fontBase: typography["Font Family"]["Default"].value,
  fontCode: typography["Font Family"]["Monospace"].value,

  // Text colors
  textColor: colors["Typography"]["Default"].value,

  appBg: colors["Structure"]["Main Background"].value,

  // Toolbar colors
  barTextColor: colors["Typography"]["Deemphasize"].value,
  barSelectedColor: colors["My Blue"].value,
  barBg: colors["Structure"]["Main Background"].value,

})

addons.setConfig({
  theme: myTheme,
});