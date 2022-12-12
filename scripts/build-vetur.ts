const fs = require("fs");
const customElementsManifest = require("../dist/custom-elements.json");

const STORYBOOK_BASE_URL =
  "https://my.github.io/design-system";


const generateStorybookLinkText = (tagName) => {
  const componentName = tagName.substring(tagName.indexOf("ao-") + 3); // extract name without prefix
  const stbLink = `${STORYBOOK_BASE_URL}/?path=/story/${componentName}`;
  return `\u000a [Open in Storybook](${stbLink})`;
};
  const generateVeturDefinitions = () => {
  const tagsObject = {};
  const attributesObject = {};

  const components = customElementsManifest.modules.filter(
    (file) =>
      file.path.includes("src/component") && !file.path.includes("index")
  );

  components.forEach((component) => {
    component.declarations.forEach((declaration) => {
      const { customElement, tagName, description, attributes, kind, name } =
        declaration;

        
      if (!customElement || !tagName) return;

      const componentAttributes = attributes
        ? attributes.map((attr) => attr.name)
        : [];

      tagsObject[tagName] = {
        description: `__${kind} ${name}__\
         ${description ? `\u000a\u000d${description}` : ""}\
         ${
           componentAttributes.length > 0
             ? `\u000a\u000d Attributes: _${componentAttributes.join(
                 ", "
               )}_ \u000a\u000d`
             : ""
         }\
        \u000a ${generateStorybookLinkText(tagName)} `,
        attributes: componentAttributes,
      };

      if (!attributes) return;

      attributes.map((attribute) => {
        const options = parseOptions(attribute.type.text);

        const attributeDescription = `${attribute.description ?? ""}\
        \u000a\u000d Value: _${attribute.type.text}_ \
        ${
          attribute.default
            ? ` \u000a\u000d Default: __${attribute.default}__`
            : ""
        }\
        `;
        attributesObject[`${tagName}/${attribute.name}`] = {
          type: attribute.type.text,
          description: attributeDescription,
          options,
        };
      });
    });
  });

  fs.writeFileSync(
    "./dist/vetur/tags.json",
    JSON.stringify(tagsObject, null, 2)
  );
  fs.writeFileSync(
    "./dist/vetur/attributes.json",
    JSON.stringify(attributesObject, null, 2)
  );
};

const parseOptions = (str) => {
  if (!str.includes("|")) return [];
  return str.split("|").map((option) => option.trim());
};


const main = async () => {
  if (!fs.existsSync("./dist/vetur")) {
    fs.mkdirSync("./dist/vetur");
  }
  generateVeturDefinitions();
};

main();
