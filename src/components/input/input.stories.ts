import { Story } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import type { AoInput } from "./input";
import { inputTypes } from "./input";

export default {
  title: "Components/Input",
  component: "ao-input",
  argTypes: {
    type: {
      type: "string",
      options: inputTypes,
      defaultValue: "text",
      control: {
        type: "select",
      },
    },
    state: {
      type: "string",
      options: ["default", "success", "invalid"],
      control: {
        type: "radio",
      },
    },
    label: {
      type: "string",
      control: {
        type: "text",
      },
    },
    name: {
      type: "string",
      control: {
        type: "text",
      },
    },
    placeholder: {
      type: "string",
      control: {
        type: "text",
      },
    },
    disabled: {
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
    checked: {
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
    indeterminate: {
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
    required: {
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
    labelHidden: {
      name: "label-hidden",
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
    buttonVariant: {
      name: "button-variant",
      type: "string",
      options: ["primary", "secondary", "tertiary"],
      defaultValue: "primary",
      control: {
        type: "radio",
      },
    },
    size: {
      type: "string",
      options: ["small", "large"],
      defaultValue: "small",
      control: {
        type: "radio",
      },
    },
    checkboxVariant: {
      type: "string",
      options: ["default", "blocklist"],
      defaultValue: "default",
      control: {
        type: "radio",
      },
    },
    optionalText: {
      name: "optional-text",
      type: "string",
      control: {
        type: "text",
      },
    },
    helpText: {
      name: "help-text",
      type: "string",
      control: {
        type: "text",
      },
    },
    errorMessage: {
      name: "error-message",
      type: "string",
      control: {
        type: "text",
      },
    },
  },
};

export const TelInput: Story<AoInput> = ({
  placeholder,
  value,
  disabled,
  label,
  labelHidden,
  state,
  required,
  pattern,
}) => html`<ao-input
  type="tel"
  placeholder=${ifDefined(placeholder)}
  value=${value}
  .disabled=${disabled}
  .label-hidden="${labelHidden}"
  label=${label}
  state=${state}
  .required=${required}
  .pattern=${pattern}
></ao-input> `;
TelInput.args = {
  value: "+1 297 18972560",
  placeholder: "0",
  disabled: false,
  label: "American phone number",
  state: "default",
  labelHidden: false,
  required: false,
};
TelInput.parameters = {
  controls: {
    include: [
      "label",
      "label-hidden",
      "value",
      "state",
      "disabled",
      "required",
      "pattern",
    ],
  },
};

export const TelInputWithFormatting: Story<AoInput> = ({
  placeholder,
  value,
  disabled,
  label,
  labelHidden,
  state,
  required,
  pattern,
}) => html`<ao-input
  type="tel"
  placeholder=${ifDefined(placeholder)}
  value=${value}
  .disabled=${disabled}
  .label-hidden="${labelHidden}"
  label=${label}
  state=${state}
  .required=${required}
  .pattern=${pattern}
  @format-value=${function(e) {
    const input = e.target;
    // Clean and leave the numbers only
    const valueClean = input.value.replace(/[^0-9]/g, '');

    // Format
    const newValue = valueClean.replace(/(\d{1,3})(\d{1,2})?(\d{1,3})?(\d{1,4})?/, function(_, p1, p2, p3, p4){
      let output = "";
      if (p1) output += `+${p1}`;
      if (p2) output += ` (${p2}`;
      if (p3) output += `) ${p3}`
      if (p4) output += `-${p4}`
      return output;
    });
    input.value = newValue;
  }}
></ao-input> `;
TelInputWithFormatting.args = {
  value: "+358  18972560",
  placeholder: "0",
  disabled: false,
  label: "Finnish phone number",
  state: "default",
  labelHidden: false,
  required: false,
};