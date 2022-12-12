import _ from "lodash";
import StyleDictionary, {
  DesignToken,
  TransformedToken,
} from "style-dictionary";
import Color from "tinycolor2";

/*
 * FORMATS
 */

/**
 * Outputs an object stripping out everything except values and description.
 * This method is an altered version of https://github.com/amzn/style-dictionary/blob/main/lib/common/formatHelpers/minifyDictionary.js
 */
function _minifyDictionary(obj: any) {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  const toRet: any = {};

  if (obj.value) {
    return obj.value;
  }
  Object.keys(obj).forEach((name) => {
    if (obj[name]) {
      // Add descirption field only for the properties with values,
      // leaves of the tree.
      if (obj[name].value) {
        toRet[name] = {
          value: _minifyDictionary(obj[name]),
          description: obj[name].description || "",
          cssVariable: `--${obj[name].name}`,
        };
      } else {
        toRet[name] = _minifyDictionary(obj[name]);
      }
    }
  });

  return toRet;
}

StyleDictionary.registerFormat({
  name: "json/with-docs",
  formatter({ dictionary }) {
    let minified = _minifyDictionary(dictionary.tokens);
    // clean the root category
    const categoriesToClean = ["Sizing", "Spacing", "Box Shadow", "Color"];
    if (categoriesToClean.indexOf(Object.entries(minified)[0][0]) !== -1) {
      minified = Object.entries(minified)[0][1];
    }
    return JSON.stringify(minified, null, 2);
  },
});

const generateSpacingClasses = (value) => `.ao-m-${value} {
  margin: var(--ao-spacing-${value});
}\n
.ao-mt-${value} {
  margin-top: var(--ao-spacing-${value});
}\n
.ao-mr-${value} {
  margin-right: var(--ao-spacing-${value});
}\n
.ao-mb-${value} {
  margin-bottom: var(--ao-spacing-${value});
}\n
.ao-ml-${value} {
  margin-left: var(--ao-spacing-${value});
}\n
.ao-mx-${value} {
  margin-left: var(--ao-spacing-${value});
  margin-right: var(--ao-spacing-${value});
}\n
.ao-my-${value} {
  margin-top: var(--ao-spacing-${value});
  margin-bottom: var(--ao-spacing-${value});
}\n
`;

StyleDictionary.registerFormat({
  name: "utilityClass",
  formatter({ dictionary }) {
    let output = "";
    dictionary.allProperties.forEach((prop) => {
      const tokenType = prop.path.slice(0, 1)[0];
      if (tokenType.toLowerCase() === "spacing") {
        output += generateSpacingClasses(prop.original.value); // we are using original value, because value is transformed and px is added to the number
      }
    });
    return output;
  },
});
/*
 * FILTERS
 */

/*
 * Token filter: filters-out the types of tokens about border
 */
StyleDictionary.registerFilter({
  name: "borderFilter",
  matcher(token) {
    return token.type.startsWith("border");
  },
});

/*
 * TRANSFORMS
 */

/*
 * Name transform: adds a prefix which comes from token category
 * Example:
 * without transform: --blue-800
 * with transform: --ao-color-blue-800
 */
StyleDictionary.registerTransform({
  name: "name/category/prefix",
  type: "name",
  transformer(token) {
    // Where to apply these transform
    const typesToInclude = ["typography", "textCase"];

    return token.type && typesToInclude.indexOf(token.type) !== -1
      ? `${_.kebabCase(token.type)}-${token.name}`
      : token.name;
  },
});

/*
 * Name transform: replace any part of variable name with another value.
 * Allows to fix quickly naming inconsistencies.\
 * Keep in mind that it applies after all the other transforms had run, for example kebab-case
 * Use with caution, always make sure the selected text part won't be found in other tokens
 * Example
 * without transform: --ao-color-app-omni-blue
 * with transform: --ao-color-my-blue
 */
const renamesMap = {
  "font-sizes": "font-size",
  "font-weights": "font-weight",
  "font-families": "font-family",
  "line-heights": "line-height",
  "gray-black": "black",
  "gray-white": "white",
  "-extended": "",
};

StyleDictionary.registerTransform({
  name: "name/renames",
  type: "name",
  transformer(token) {
    let name = token.name;
    Object.entries(renamesMap).forEach(([original, renamed]) => {
      name = name.replace(original, renamed);
    });
    return name;
  },
});

/*
 * Value transform: unwrap box shadow tokens and concat into a css string
 */
interface ShadowToken extends DesignToken {
  value: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    type: string;
  };
}

// https://github.com/amzn/style-dictionary/blob/a12a31fe14ca9500c03608c8dc2c35361339af96/lib/common/transforms.js#L512
function colorToCss(colorString: string) {
  const color = Color(colorString);
  if (color.getAlpha() === 1) {
    return color.toHexString();
  }
  return color.toRgbString();
}

function wrapValueWith(character: string, token: TransformedToken) {
  return `${character}${token.value}${character}`;
}

StyleDictionary.registerTransform({
  name: "shadow/css",
  type: "value",
  matcher: (token) => token.type === "boxShadow",
  transformer: (token: ShadowToken) => {
    function getShadowString({
      x,
      y,
      blur,
      spread,
      color,
      type,
    }: ShadowToken["value"]) {
      return `${x}px ${y}px ${blur}px ${spread}px ${colorToCss(color)}${
        type !== "dropShadow" ? " inset" : ""
      }`;
    }

    if (Array.isArray(token.value)) {
      return token.value.map(getShadowString).join();
    }
    return getShadowString(token.value);
  },
});

/*
 * Value transform: add "px" to size/spacing values
 */
StyleDictionary.registerTransform({
  name: "number/px",
  type: "value",
  matcher: (token) =>
    typeof token.value === "number" &&
    ["opacity", "fontWeights"].indexOf(token.type) === -1,
  transformer: (token) => `${token.value}px`,
});

/*
 * Value transform: put font family name in quotes
 */
StyleDictionary.registerTransform({
  name: "font/quote",
  type: "value",
  matcher: (token) => token?.attributes?.category === "content",
  transformer: (token) => wrapValueWith("'", token),
});

const typographyCategories = [
  "fontSizes",
  "textCase",
  "textDecoration",
  "letterSpacing",
  "paragraphSpacing",
  "fontWeights",
  "fontFamilies",
  "lineHeights",
];

const isTypographyToken = (token: DesignToken) =>
  typographyCategories.includes(token.type);

const tokenCategories = [
  "color",
  "typography",
  "sizing",
  "spacing",
  "boxShadow",
  ...typographyCategories,
];

const options = {
  source: ["src/tokens/converted.json"],
  platforms: {
    ts: {
      transformGroup: "js",
      buildPath: "src/tokens/build/",
      prefix: "ao",
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "name/category/prefix",
        "name/renames",
        "number/px",
        "shadow/css",
      ],
      files: [
        {
          format: "json/with-docs",
          destination: "colors.json",
          options: {
            outputReferences: true,
          },
          filter: { type: "color" },
        },
        {
          format: "json/with-docs",
          destination: "typography.json",
          options: {
            outputReferences: true,
          },
          filter: isTypographyToken,
        },
        {
          format: "json/with-docs",
          destination: "sizing.json",
          options: {
            outputReferences: true,
          },
          filter: { type: "sizing" },
        },
        {
          format: "json/with-docs",
          destination: "spacing.json",
          options: {
            outputReferences: true,
          },
          filter: { type: "spacing" },
        },
        {
          format: "json/with-docs",
          destination: "shadow.json",
          options: {
            outputReferences: true,
          },
          filter: { type: "boxShadow" },
        },
        {
          format: "json/with-docs",
          destination: "border.json",
          options: {
            outputReferences: true,
          },
          filter: "borderFilter",
        },
      ],
    },
    css: {
      transformGroup: "css",
      buildPath: "src/tokens/build/",
      prefix: "ao",

      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "name/category/prefix",
        "name/renames",
        "number/px",
        "color/css",
        "shadow/css",
        "content/quote",
        "font/quote",
      ],
      files: [
        {
          destination: "_colors.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: { type: "color" },
        },
        {
          destination: "_typography.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: isTypographyToken,
        },
        {
          destination: "_spacing.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: { type: "spacing" },
        },
        {
          destination: "_sizing.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: { type: "sizing" },
        },
        {
          destination: "_shadow.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: { type: "boxShadow" },
        },
        {
          destination: "_border.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: "borderFilter",
        },
        {
          destination: "_rest.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
          filter: (token: DesignToken) => !tokenCategories.includes(token.type),
        },
        {
          destination: "_utility-classes.css",
          format: "utilityClass",
        },
      ],
    },
  },
};

StyleDictionary.extend(options).buildAllPlatforms();
